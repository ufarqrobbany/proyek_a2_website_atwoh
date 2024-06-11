import json

# Step 1: Baca list brand pada brands.json
try:
    with open('brands.json', 'r', encoding='utf-8') as file:
        brands = json.load(file)
except FileNotFoundError:
    print("The file brands.json was not found.")
    exit()
except json.JSONDecodeError:
    print("Failed to decode JSON from the file brands.json.")
    exit()
except UnicodeDecodeError:
    print("Failed to read the file brands.json due to encoding issues.")
    exit()

# Step 2: Baca tokopedia_data.json
try:
    with open('tokopedia_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
except FileNotFoundError:
    print("The file tokopedia_data.json was not found.")
    exit()
except json.JSONDecodeError:
    print("Failed to decode JSON from the file tokopedia_data.json.")
    exit()
except UnicodeDecodeError:
    print("Failed to read the file tokopedia_data.json due to encoding issues.")
    exit()

# Step 3: Proses setiap item untuk menambahkan brand
for category in data:
    for item in category['items']:
        item_brand = ""
        item_title_lower = item['title'].lower()
        for brand in brands:
            brand_name_lower = brand['name'].lower()
            alternative_names_lower = [alt.lower() for alt in brand['alternative_names']]
            if brand_name_lower in item_title_lower or any(alt_name in item_title_lower for alt_name in alternative_names_lower):
                item_brand = brand['name']
                break
        item['brand'] = item_brand

# Step 4: Simpan JSON yang telah dimodifikasi ke file baru
try:
    with open('output.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)
    print("The output has been saved to output.json.")
except Exception as e:
    print(f"An error occurred while saving the output: {e}")
