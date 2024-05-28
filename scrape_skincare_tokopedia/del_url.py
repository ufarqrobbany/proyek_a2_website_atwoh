import json

# Path ke file input dan output
input_file_path = 'tokopedia_data.json'
output_file_path = 'tokopedia_data_no_urls.json'

try:
    # Load JSON data from a file
    with open(input_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Remove 'url' key from each item in the JSON data
    for category in data:
        for item in category['items']:
            if 'url' in item:
                del item['url']

    # Save the modified data to a new file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    print(f"URLs removed and data saved to {output_file_path}")

except FileNotFoundError:
    print(f"File not found: {input_file_path}")
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
