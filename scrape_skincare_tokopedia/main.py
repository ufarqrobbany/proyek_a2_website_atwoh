from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os
import json

# Initialize Chrome options
chrome_options = Options()
# Uncomment the following lines to run Chrome in headless mode and minimized
chrome_options.add_argument("--headless")
chrome_options.add_argument("--start-minimized")

# Start the Chrome driver
driver = webdriver.Chrome(options=chrome_options)

# Set implicit wait to 10 seconds
driver.implicitly_wait(10)

# Open Tokopedia website
driver.get("https://www.tokopedia.com/")

# Search for the product
search_box = driver.find_element(By.XPATH, '//*[@id="header-main-wrapper"]/div[2]/div[2]/div/div/div/div/input')
search_box.send_keys("face wash acne\n")

# Wait for the page to load
time.sleep(5)

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

arr_of_dict = []

os.system('cls')

for i in range(20):
    jumlah_produk_per_halaman = 0
    time.sleep(5)

    total_height = driver.execute_script("return document.body.scrollHeight") * 10
    for position in range(0, total_height, 100):
        driver.execute_script(f"window.scrollTo(0, {position});")

    # Locate product list container
    all_selected = driver.find_element(By.XPATH, '//*[@id="zeus-root"]/div/div[2]/div/div[2]/div[4]')
    lines = all_selected.find_elements(By.CLASS_NAME, "css-jza1fo")

    for product in lines:
        try:
            objs = product.find_elements(By.CLASS_NAME, "css-llwpbs")
        except:
            continue

        for obj in objs:
            try:
                product_link = obj.find_element(By.CLASS_NAME, "css-1asz3by").find_element(By.TAG_NAME, 'a')
                url = product_link.get_attribute('href')
                title = product_link.find_element(By.CLASS_NAME, "css-3um8ox").text
                price_str = product_link.find_element(By.CLASS_NAME, "css-h66vau").text
                rating_str = product_link.find_element(By.CLASS_NAME, "css-t70v7i").text
                terjual_str = product_link.find_element(By.CLASS_NAME, "css-1sgek4h").text

                price = clean_price(price_str)
                rating = clean_rating(rating_str)
                terjual = clean_terjual(terjual_str)

                print(jumlah_produk_per_halaman + 1)
                print(url)
                print(title)
                print(price)
                print(rating)
                print(terjual)
                print()

                dataset = createDataset()
                dataset['url'] = url
                dataset['title'] = title
                dataset['price'] = price
                dataset['rating'] = rating
                dataset['terjual'] = terjual
                arr_of_dict.append(dataset)

                jumlah_produk_per_halaman += 1
            except Exception as e:
                print(f"Error: {e}")
                pass

    total_height = driver.execute_script("return document.body.scrollHeight")
    for position in range(total_height, 0, -100):
        driver.execute_script(f"window.scrollTo(0, {position});")

    print(f"jumlah produk halaman {i + 1}: {jumlah_produk_per_halaman}")
    driver.get(f"https://www.tokopedia.com/search?navsource=home&page={2 + i}&q=face+wash+acne&source=universe&srp_component_id=01.02.01.01&st=product")
    driver.implicitly_wait(10)
    print()
    print()

# Save data to JSON file
with open('tokopedia_data.json', 'w', encoding='utf-8') as f:
    json.dump(arr_of_dict, f, ensure_ascii=False, indent=4)

driver.quit()

# while True:
#     pass
