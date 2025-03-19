import requests
from app.models import db, Spell  # Ensure you have a Spell model defined
from app import create_app
from app.spell_data_fetcher import get_spells

def populate_spells():
    """Populate the database with spells fetched from the D&D5e API."""
    spells = get_spells()
    for spell_data in spells:
        # Create a new Spell object
        new_spell = Spell(
            spell_index=spell_data["spell_index"],
            name=spell_data["name"],
            level=spell_data["level"],
            school=spell_data["school"],
            casting_time=spell_data["casting_time"],
            range=spell_data["range"],
            components=spell_data["components"],
            duration=spell_data["duration"],
            concentration=spell_data["concentration"],
            ritual=spell_data["ritual"],
            description=spell_data["description"],
            higher_level=spell_data["higher_level"],
            damage=spell_data["damage"],
            materials=spell_data["materials"],
            classes=spell_data["classes"],
            subclasses=spell_data["subclasses"],
            url=spell_data["url"],
        )
        
        # Add the spell to the database session
        db.session.add(new_spell)
    
    # Commit the session to save all spells
    db.session.commit()
    print("Database populated with spells!")

if __name__ == "__main__":
    # Create the Flask app context
    app = create_app()
    with app.app_context():
        populate_spells()