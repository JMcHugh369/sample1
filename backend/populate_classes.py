import requests
from app.models import db, Classes
from app import create_app

BASE_URL = "https://www.dnd5eapi.co/api"

def fetch_classes():
    """Fetch all classes from the D&D5e API."""
    response = requests.get(f"{BASE_URL}/classes")
    if response.status_code != 200:
        raise Exception("Failed to fetch classes data")
    classes_data = response.json()["results"]

    classes = []
    for class_data in classes_data:
        # Fetch detailed data for each class
        detail_response = requests.get(f"{BASE_URL}/classes/{class_data['index']}")
        if detail_response.status_code != 200:
            continue
        detail_data = detail_response.json()

        classes.append({
            "class_index": detail_data["index"],
            "name": detail_data["name"],
            "hit_die": detail_data["hit_die"],
            "proficiencies": detail_data.get("proficiencies", []),
            "saving_throws": detail_data.get("saving_throws", []),
            "subclasses": detail_data.get("subclasses", []),
            "spellcasting": detail_data.get("spellcasting", None),
            "url": detail_data["url"],
        })
    return classes

def populate_classes():
    """Populate the database with classes fetched from the D&D5e API."""
    app = create_app()
    with app.app_context():
        classes = fetch_classes()
        for class_data in classes:
            new_class = Classes(
                class_index=class_data["class_index"],
                name=class_data["name"],
                hit_die=class_data["hit_die"],
                proficiencies=class_data["proficiencies"],
                saving_throws=class_data["saving_throws"],
                subclasses=class_data["subclasses"],
                spellcasting=class_data["spellcasting"],
                url=class_data["url"],
            )
            db.session.add(new_class)
        db.session.commit()
        print("Classes table populated successfully!")
        
if __name__ == "__main__":
    populate_classes()