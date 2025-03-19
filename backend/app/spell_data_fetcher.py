import requests

BASE_URL = "https://www.dnd5eapi.co/api"

def fetch_data(endpoint):
    """Fetch data from the D&D5e API."""
    response = requests.get(f"{BASE_URL}/{endpoint}")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from {endpoint}: {response.status_code}")

def get_spells():
    """Fetch all spells from the D&D5e API."""
    spells_data = fetch_data("spells")
    spells = []
    for spell in spells_data["results"]:
        spell_details = fetch_data(f"spells/{spell['index']}")
        spells.append({
            "spell_index": spell_details["index"],
            "name": spell_details["name"],
            "level": spell_details["level"],
            "school": spell_details["school"]["name"],
            "casting_time": spell_details["casting_time"],
            "range": spell_details["range"],
            "components": ", ".join(spell_details["components"]),
            "duration": spell_details["duration"],
            "concentration": spell_details.get("concentration", False),
            "ritual": spell_details.get("ritual", False),
            "description": " ".join(spell_details.get("desc", [])),
            "higher_level": " ".join(spell_details.get("higher_level", [])),
            "damage": spell_details.get("damage"),
            "materials": spell_details.get("material"),
            "classes": [cls["name"] for cls in spell_details.get("classes", [])],
            "subclasses": [subcls["name"] for subcls in spell_details.get("subclasses", [])],
            "url": spell_details.get("url"),
        })
    return spells