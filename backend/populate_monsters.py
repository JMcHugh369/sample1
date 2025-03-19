import requests
from app.models import db, Monster  # Use absolute imports
from app import create_app

BASE_URL = "https://www.dnd5eapi.co/api"

def fetch_data(endpoint):
    """Fetch data from the D&D5e API."""
    response = requests.get(f"{BASE_URL}/{endpoint}")
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from {endpoint}: {response.status_code}")

def populate_monsters():
    """Fetch all monsters from the D&D5e API and populate the database."""
    monsters_data = fetch_data("monsters")
    for monster in monsters_data["results"]:
        monster_details = fetch_data(f"monsters/{monster['index']}")
        
        # Create a new Monster object
        new_monster = Monster(
            monster_index=monster_details["index"],  # Updated field name
            name=monster_details["name"],
            size=monster_details["size"],
            type=monster_details["type"],
            alignment=monster_details.get("alignment"),
            armor_class=monster_details.get("armor_class"),
            hit_points=monster_details["hit_points"],
            hit_dice=monster_details["hit_dice"],
            hit_points_roll=monster_details.get("hit_points_roll"),
            speed=monster_details["speed"],
            strength=monster_details["strength"],
            dexterity=monster_details["dexterity"],
            constitution=monster_details["constitution"],
            intelligence=monster_details["intelligence"],
            wisdom=monster_details["wisdom"],
            charisma=monster_details["charisma"],
            proficiencies=monster_details.get("proficiencies"),
            damage_vulnerabilities=", ".join(monster_details.get("damage_vulnerabilities", [])),
            damage_resistances=", ".join(monster_details.get("damage_resistances", [])),
            damage_immunities=", ".join(monster_details.get("damage_immunities", [])),
            condition_immunities=", ".join([ci["name"] for ci in monster_details.get("condition_immunities", [])]),
            senses=monster_details.get("senses"),
            passive_perception=monster_details["senses"].get("passive_perception"),
            languages=monster_details.get("languages"),
            challenge_rating=monster_details["challenge_rating"],
            proficiency_bonus=monster_details.get("proficiency_bonus"),
            xp=monster_details["xp"],
            special_abilities=monster_details.get("special_abilities"),
            actions=monster_details.get("actions"),
            legendary_actions=monster_details.get("legendary_actions"),
            image_url=monster_details.get("image"),
        )
        
        # Add the monster to the database session
        db.session.add(new_monster)
    
    # Commit the session to save all monsters
    db.session.commit()
    print("Database populated with monsters!")

if __name__ == "__main__":
    # Create the Flask app context
    app = create_app()
    with app.app_context():
        populate_monsters()