import json
import requests
import os
import re

# Function to sanitize the product ID for use as a file name
def sanitize_id(id):
    return re.sub(r'\D', '', str(id))

# Function to sanitize the product name for use as a file name
def sanitize_filename(name):
    return re.sub(r'[<>:"/\\|?*\x00-\x1F]', '_', name)

# Open and read the abc.json file
with open('ab.json', 'r') as file:
    products = [json.loads(line) for line in file]

# Create a directory to save the images
os.makedirs('product_images', exist_ok=True)

# List to store products whose images failed to download
failed_downloads = []
# List to store products whose images were successfully downloaded
successful_downloads = []

# Loop through each product in the JSON, but only up to ID 25
for product in products:
    product_id = int(product.get('ID', 0))  # Assuming the ID field is present in the JSON
    if product_id > 25:
        continue

    # Sanitize the product ID for the filename
    product_id_str = sanitize_id(product_id)

    link = product.get('Link')

    # Skip if no link is provided
    if not link:
        print(f"No image link for product ID {product_id_str}")
        failed_downloads.append(product)
        continue

    # Handle multiple links (if separated by newline characters)
    links = link.split('\n')
    download_failed = False
    downloaded_files = []
    for idx, img_link in enumerate(links):
        img_link = img_link.strip()
        if not img_link:
            print(f"Invalid URL for product ID {product_id_str}")
            download_failed = True
            continue

        try:
            response = requests.get(img_link)
            response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

            # Save the image with the product ID as the file name (with underscores for multiple images)
            file_name = f"{product_id_str}.jpg" if idx == 0 else f"{product_id_str}_{idx + 1}.jpg"
            file_path = f'product_images/{file_name}'
            with open(file_path, 'wb') as img_file:
                img_file.write(response.content)
            downloaded_files.append(file_path)
            print(f"Downloaded {file_name}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download product ID {product_id_str}: {e}")
            download_failed = True
    
    # If any link for the product failed, add it to the failed_downloads list
    if download_failed:
        failed_downloads.append(product)
    else:
        # Modify the product keys as requested: "Product Name" -> "name", "Link" -> "image", "Price (INR)" -> "price"
        product['name'] = sanitize_filename(product.get('Product Name', ''))  # Keep the sanitized product name
        product['image'] = downloaded_files  # Replace 'Link' with local file paths
        product['price'] = product.pop('Price (INR)', '')
        successful_downloads.append(product)

# Save the failed downloads into a new JSON file
if failed_downloads:
    with open('failed_downloads.json', 'w') as fail_file:
        json.dump(failed_downloads, fail_file, indent=4)

    print(f"Failed downloads saved to 'failed_downloads.json'")

# Save the successfully downloaded images into a new JSON file
if successful_downloads:
    with open('downloaded_images.json', 'w') as success_file:
        json.dump(successful_downloads, success_file, indent=4)

    print(f"Successfully downloaded images saved to 'downloaded_images.json'")
