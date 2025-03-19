import requests
from app.models import db, Feature
from app import create_app

BASE_URL = "https://www.dnd5eapi.co/api"

def fetch_features():
    """Fetch all features from the D&D5e API."""
    response = requests.get(f"{BASE_URL}/features")
    if response.status_code != 200:
        raise Exception("Failed to fetch features data")
    features_data = response.json()["results"]

    features = []
    for feature_data in features_data:
        # Fetch detailed data for each feature
        detail_response = requests.get(f"{BASE_URL}/features/{feature_data['index']}")
        if detail_response.status_code != 200:
            continue
        detail_data = detail_response.json()

        features.append({
            "feature_index": detail_data["index"],
            "name": detail_data["name"],
            "level": detail_data.get("level"),
            "class_name": detail_data.get("class", {}).get("name"),
            "subclass_name": detail_data.get("subclass", {}).get("name"),
            "description": " ".join(detail_data.get("desc", [])),
            "url": detail_data["url"],
        })
    return features

def populate_features():
    """Populate the database with features fetched from the D&D5e API."""
    app = create_app()
    with app.app_context():
        features = fetch_features()
        for feature_data in features:
            new_feature = Feature(
                feature_index=feature_data["feature_index"],
                name=feature_data["name"],
                level=feature_data["level"],
                class_name=feature_data["class_name"],
                subclass_name=feature_data["subclass_name"],
                description=feature_data["description"],
                url=feature_data["url"],
            )
            db.session.add(new_feature)
        db.session.commit()
        print("Features table populated successfully!")

if __name__ == "__main__":
    populate_features()