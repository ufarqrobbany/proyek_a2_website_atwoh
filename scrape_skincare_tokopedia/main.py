from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os
import json

# Initialize Chrome options
chrome_options = Options()
# chrome_options.add_argument("--headless")
# chrome_options.add_argument("--start-minimized")

# Start the Chrome driver
driver = webdriver.Chrome(options=chrome_options)

# Set implicit wait to 10 seconds
driver.implicitly_wait(10)


def createDataset():
    return {
        "url": "",
        "title": "",
        "price": 0,
        "rating": 0.0,
        "terjual": 0
    }


def clean_price(price_str):
    return int(price_str.replace('Rp', '').replace('.', ''))


def clean_rating(rating_str):
    return float(rating_str)


def clean_terjual(terjual_str):
    terjual_str = terjual_str.replace('terjual', '').replace('+', '').strip()
    if 'rb' in terjual_str:
        return int(float(terjual_str.replace('rb', '')) * 1000)
    return int(terjual_str)


def scroll_to_bottom():
    total_height = driver.execute_script("return document.body.scrollHeight") * 10
    for position in range(0, total_height, 100):
        driver.execute_script(f"window.scrollTo(0, {position});")


def scroll_to_top():
    total_height = driver.execute_script("return document.body.scrollHeight")
    for position in range(total_height, 0, -100):
        driver.execute_script(f"window.scrollTo(0, {position});")


def scrape_page():
    arr_of_dict = []
    for i in range(3):
        time.sleep(3)
        scroll_to_bottom()

    # all_selected = driver.find_element(By.XPATH, '//*[@id="zeus-root"]/div/div[2]/div/div[2]/div[4]')
    all_selected = driver.find_element(By.XPATH, '//*[@data-testid="divSRPContentProducts"]')
    lines = all_selected.find_elements(By.CLASS_NAME, "css-jza1fo")
    if len(lines) == 0:
        print("No lines found")

    for product in lines:
        try:
            objs = product.find_elements(By.CLASS_NAME, "css-llwpbs")
        except:
            print("No objects found")
            continue

        for obj in objs:
            try:
                try:
                    product_link = obj.find_element(By.CLASS_NAME, "css-1asz3by").find_element(By.TAG_NAME, 'a')
                except:
                    print("No product found")
                    continue

                url = product_link.get_attribute('href')
                title = product_link.find_element(By.CLASS_NAME, "css-3um8ox").text
                price_str = product_link.find_element(By.CLASS_NAME, "css-h66vau").text

                try:
                    rating_str = product_link.find_element(By.CLASS_NAME, "css-t70v7i").text
                    rating = clean_rating(rating_str)
                except:
                    rating = None

                try:
                    terjual_str = product_link.find_element(By.CLASS_NAME, "css-1sgek4h").text
                    terjual = clean_terjual(terjual_str)
                except:
                    terjual = None

                price = clean_price(price_str)

                print(f"     {len(arr_of_dict) + 1} - {title}")

                dataset = createDataset()
                dataset['url'] = url
                dataset['title'] = title
                dataset['price'] = price
                dataset['rating'] = rating
                dataset['terjual'] = terjual
                arr_of_dict.append(dataset)

            except Exception as e:
                print(f"Error: {e}")
                pass
    scroll_to_top()
    return arr_of_dict


def scrape_data(search_term, label):
    arr_of_dict = []

    print("=====================================")
    print(f"Kategori \"{label}\"")
    for i in range(20):
        retries = 3
        while retries > 0:
            if i != 0:
                driver.get(f"https://www.tokopedia.com/search?navsource=home&page={1 + i}&q={search_term}&source=universe&srp_component_id=01.02.01.01&st=product")
                driver.implicitly_wait(10)
            page_data = scrape_page()
            if len(page_data) >= 50:
                arr_of_dict.extend(page_data)
                print(f"Halaman {i + 1}: {len(page_data)} produk berhasil diambil.")
                # Append data directly to the JSON file
                append_to_json(label, page_data)
                break
            else:
                retries -= 1
                print(f"Halaman {i + 1}: {len(page_data)} produk berhasil diambil. Gagal mengambil semua produk, mencoba lagi ({3 - retries} / 3)")

        if retries == 0:
            print(f"Gagal mengambil semua produk di halaman {i + 1} setelah 3 kali percobaan, melanjutkan ke label berikutnya.")
            return


def append_to_json(label, new_items):
    try:
        if not os.path.isfile('tokopedia_data.json'):
            with open('tokopedia_data.json', 'w', encoding='utf-8') as f:
                json.dump([{"label": label, "items": new_items}], f, ensure_ascii=False, indent=4)
        else:
            with open('tokopedia_data.json', 'r+', encoding='utf-8') as f:
                try:
                    file_data = json.load(f)
                except json.JSONDecodeError:
                    file_data = []

                # Check if the label exists
                label_exists = False
                for entry in file_data:
                    if entry['label'] == label:
                        entry['items'].extend(new_items)
                        label_exists = True
                        break

                if not label_exists:
                    file_data.append({"label": label, "items": new_items})

                f.seek(0)
                json.dump(file_data, f, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Error appending to JSON file: {e}")


search_terms = [
    {"term": "face wash acne", "label": "Acne"},
    {"term": "face wash brightening", "label": "Brightening"},
    {"term": "face wash anti aging", "label": "Anti Aging"}
]

os.system('cls')

for search in search_terms:
    driver.get("https://www.tokopedia.com/")
    search_box = driver.find_element(By.XPATH, '//*[@id="header-main-wrapper"]/div[2]/div[2]/div/div/div/div/input')
    search_box.send_keys(f"{search['term']}\n")
    time.sleep(10)

    scrape_data(search["term"], search["label"])

driver.quit()
