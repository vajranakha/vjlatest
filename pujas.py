import json

# Load the existing JSON file
with open('updated_pujas.json', 'r') as file:
    pujas_data = json.load(file)

# Add 'sizes' field to each puja
for puja in pujas_data:
    individual_price = puja.get('Individual', 0)
    family_price = puja.get('Family', 0)
    
    puja['sizes'] = [
        {
            "size": "Individual",
            "price": individual_price
        },
        {
            "size": "Family",
            "price": family_price
        }
    ]

# Save the modified data to a new JSON file
with open('final_pujas.json', 'w') as file:
    json.dump(pujas_data, file, indent=4)

print("Updated JSON file created as 'final_pujas.json'.")
