'''
    Note(s) for myself:
        - Test every endpoint before frontend integration
        
    This file:
        - Contains API endpoints for testing and 
            - User Management
            - Admin Management
            - DM Management
'''

from flask import Blueprint, request, jsonify, current_app
from .database import db
from .models import User, Admin  # Import the User model
from .models import Campaign
from app.models import Character
import os
from flask import send_from_directory
import random
import string

main = Blueprint("main", __name__)  # Define the blueprint

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")

def set_upload_folder(app):
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

'''
    API endpoint testing
'''

@main.route("/api/test", methods=["GET"])
def test_api():
    return jsonify(message="Hello, World!")

@main.route("/example", methods=["GET"])
def example_route():
    return jsonify({"message": "Hello, World!"})

@main.route("/")
def home():
    return "Hello, World!"

@main.route("/data", methods=["GET"])
def get_data():
    sample_data = {"key": "value"}
    return jsonify(sample_data)

@main.route("/login", methods=["POST"])
def login():
    with current_app.app_context():  # Ensure app context
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            return jsonify({"message": "Login successful", "user_id": user.id}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

@main.route("/signup", methods=["POST"])
def signup():
    # Get the data from the request body
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    discord = data.get("discord")
    email = data.get("email")

    # Validate the input
    if not username or not password or not discord or not email:
        return jsonify({"error": "All fields are required"}), 400

    # Check if the username or email already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409

    # Create a new user
    new_user = User(username=username, password=password, discord=discord, email=email)

    # Add the user to the database
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while creating the user"}), 500

@main.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "discord": user.discord,
            "image_url": (
                user.image_url if user.image_url and user.image_url.startswith("http")
                else f"http://localhost:5001/{user.image_url}" if user.image_url
                else None
            )
        }
        for user in users
    ])

@main.route("/users/<int:user_id>", methods=["PUT"])
def update_user_by_id(user_id):
    # Get the data from the request body
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    discord = data.get("discord")
    email = data.get("email")
    image_url = data.get("image_url")  # New attribute

    # Query the database for the user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's details
    if username:
        user.username = username
    if password:
        user.password = password
    if discord:
        user.discord = discord
    if email:
        user.email = email
    if image_url:
        user.image_url = image_url

    # Commit the changes to the database
    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while updating the user"}), 500

@main.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "discord": user.discord,
        "image_url": (
            user.image_url if user.image_url and user.image_url.startswith("http")
            else f"http://localhost:5001/{user.image_url}" if user.image_url
            else None
        )
    }), 200

'''
    API endpoint for updating a user with file upload
'''
@main.route("/users/update", methods=["PUT"])
def update_user():
    user_id = request.form.get("user_id")
    username = request.form.get("username")
    email = request.form.get("email")
    discord = request.form.get("discord")
    image_file = request.files.get("image_file")

    print("User ID:", user_id)
    print("Username:", username)
    print("Email:", email)
    print("Discord:", discord)
    print("Image File:", image_file)

    if not user_id or not user_id.isdigit():
        return jsonify({"error": "Invalid or missing user ID"}), 400

    user_id = int(user_id)
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update user fields
    if username:
        user.username = username
    if email:
        user.email = email
    if discord:
        user.discord = discord

    # Save the uploaded file
    if image_file:
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], image_file.filename)
        print("Saving file to:", file_path)  # Debug log
        image_file.save(file_path)
        
        # Ensure the image_url is set correctly
        if not image_file.filename.startswith("http://"):
            user.image_url = f"http://localhost:5001/uploads/{image_file.filename}"
        else:
            user.image_url = image_file.filename

    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print("Database Commit Error:", e)
        return jsonify({"error": "An error occurred while updating the user"}), 500

@main.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@main.route("/campaigns/create", methods=["POST"])
def create_campaign():
    data = request.get_json()
    name = data.get("name")
    dm_id = data.get("dm_id")

    if not name or not dm_id:
        return jsonify({"error": "Name and DM ID are required"}), 400

    # Generate a random 8-character access code
    access_code = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

    # Create the campaign
    campaign = Campaign(name=name, access_code=access_code, dm_id=dm_id)
    db.session.add(campaign)

    try:
        db.session.commit()
        return jsonify({
            "id": campaign.id,
            "name": campaign.name,
            "access_code": campaign.access_code,
            "dm_id": campaign.dm_id,
            "player_ids": campaign.player_ids
        }), 201
    except Exception as e:
        db.session.rollback()
        print("Database Commit Error:", e)
        return jsonify({"error": "An error occurred while creating the campaign"}), 500

@main.route("/campaigns/join", methods=["POST"])
def join_campaign():
    data = request.get_json()
    user_id = data.get("user_id")
    campaign_name = data.get("campaign_name")
    access_code = data.get("access_code")

    # Validate input
    if not user_id or not campaign_name or not access_code:
        return jsonify({"error": "User ID, campaign name, and access code are required"}), 400

    # Find the campaign by name and access code
    campaign = Campaign.query.filter_by(name=campaign_name, access_code=access_code).first()

    if not campaign:
        return jsonify({"error": "Campaign not found"}), 404

    # Check if the user is the DM of the campaign
    if campaign.dm_id == user_id:
        return jsonify({"error": "You cannot join your own campaign as a player"}), 400

    # Check if the user is already in the campaign
    if campaign.player_ids and user_id in campaign.player_ids:
        return jsonify({"error": "You are already a player in this campaign"}), 400

    # Add the user to the player_ids field
    if campaign.player_ids is None:
        campaign.player_ids = []  # Initialize the list if it's empty
    campaign.player_ids.append(user_id)

    try:
        db.session.commit()
        return jsonify({"message": "Successfully joined the campaign"}), 200
    except Exception as e:
        db.session.rollback()
        print("Database Commit Error:", e)
        return jsonify({"error": "An error occurred while joining the campaign"}), 500

@main.route("/campaigns/user", methods=["GET"])
def get_user_campaigns():
    user_id = request.args.get("user_id")

    if not user_id or not user_id.isdigit():
        return jsonify({"error": "Invalid or missing user ID"}), 400

    user_id = int(user_id)

    dm_campaigns = Campaign.query.filter_by(dm_id=user_id).all()
    player_campaigns = Campaign.query.filter(Campaign.player_ids.contains([user_id])).all()

    campaigns = dm_campaigns + player_campaigns

    campaigns_data = [
        {
            "id": campaign.id,
            "name": campaign.name,
            "access_code": campaign.access_code if campaign.dm_id == user_id else None,
            "role": "DM" if campaign.dm_id == user_id else "Player",
            "dm_username": User.query.get(campaign.dm_id).username,  # Fetch DM's username
            "players": [
                User.query.get(player_id).username if User.query.get(player_id) else "Unknown"
                for player_id in (campaign.player_ids or [])
            ],  # Fetch players' usernames
        }
        for campaign in campaigns
    ]

    return jsonify({"campaigns": campaigns_data}), 200

@main.route("/campaigns/delete/<int:campaign_id>", methods=["DELETE"])
def delete_campaign(campaign_id):
    try:
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        db.session.delete(campaign)
        db.session.commit()

        return jsonify({"message": "Campaign deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main.route("/campaigns/leave/<int:campaign_id>", methods=["POST"])
def leave_campaign(campaign_id):
    """
    Remove the user from the campaign's player list.
    """
    try:
        user_id = request.json.get("user_id")  # Get the user ID from the request body
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Query the campaign
        campaign = Campaign.query.get(campaign_id)
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        # Check if the user is in the campaign's player list
        if user_id in campaign.player_ids:
            campaign.player_ids.remove(user_id)  # Remove the user from the player list
            db.session.commit()
            return jsonify({"message": "You have left the campaign."}), 200
        else:
            return jsonify({"error": "User is not part of this campaign."}), 400
    except Exception as e:
        print("Error leaving campaign:", e)
        return jsonify({"error": "An error occurred while leaving the campaign."}), 500

@main.route("/characters/create", methods=["POST"])
def create_character():
    data = request.json
    print("Request Data:", data)  # Debug log

    try:
        new_character = Character(
            user_id=data["user_id"],  # Ensure user_id is included
            name=data["name"],
            character_class=data["character_class"],
            species=data["species"],
            background=data.get("background"),
            level=data.get("level", 1),
            size=data.get("size", 30),
            alignment=data.get("alignment"),
            proficiency_bonus=data.get("proficiency_bonus", 2),
            no_hit_dice=data.get("no_hit_dice"),
            per_level=data.get("per_level"),
            strength=data.get("strength", 10),
            dexterity=data.get("dexterity", 10),
            constitution=data.get("constitution", 10),
            intelligence=data.get("intelligence", 10),
            wisdom=data.get("wisdom", 10),
            charisma=data.get("charisma", 10),
            armor_class=data.get("armor_class", 10),
            initiative=data.get("initiative", 0),
            speed=data.get("speed", 30),
            hit_points=data.get("hit_points", 10),
        )
        db.session.add(new_character)
        db.session.commit()
        return jsonify({"message": "Character created successfully", "character": new_character.to_dict()}), 201
    except Exception as e:
        print("Error:", str(e))  # Debug log
        return jsonify({"error": str(e)}), 400

@main.route("/characters/user/<int:user_id>", methods=["GET"])
def get_user_characters(user_id):
    """
    Fetch all characters for a specific user by their user_id.
    """
    try:
        # Query the database for characters belonging to the given user_id
        characters = Character.query.filter_by(user_id=user_id).all()  # Use 'Character' instead of 'Characters'

        if not characters:
            return jsonify({"message": "No characters found for this user."}), 404

        # Convert the query results to a list of dictionaries
        characters_data = [
            {
                "id": character.id,
                "name": character.name,
                "character_class": character.character_class,
                "species": character.species,
                "background": character.background,
                "level": character.level,
                "size": character.size,
                "alignment": character.alignment,
                "proficiency_bonus": character.proficiency_bonus,
                "no_hit_dice": character.no_hit_dice,
                "per_level": character.per_level,
            }
            for character in characters
        ]

        return jsonify({"characters": characters_data}), 200
    except Exception as e:
        print("Error fetching characters:", e)
        return jsonify({"error": "An error occurred while fetching characters."}), 500

@main.route("/characters/<int:character_id>", methods=["GET"])
def get_character_details(character_id):
    """
    Fetch details for a specific character by its ID.
    """
    try:
        # Query the database for the character with the given ID
        character = Character.query.get(character_id)

        if not character:
            return jsonify({"message": "Character not found"}), 404

        # Convert the character object to a dictionary
        character_data = {
            "id": character.id,
            "name": character.name,
            "character_class": character.character_class,
            "species": character.species,
            "background": character.background,
            "level": character.level,
            "size": character.size,
            "alignment": character.alignment,
            "proficiency_bonus": character.proficiency_bonus,
            "no_hit_dice": character.no_hit_dice,
            "per_level": character.per_level,
            "passive_perception": character.passive_perception,
            "strength": character.strength,
            "dexterity": character.dexterity,
            "constitution": character.constitution,
            "intelligence": character.intelligence,
            "wisdom": character.wisdom,
            "charisma": character.charisma,
            "armor_class": character.armor_class,
            "initiative": character.initiative,
            "speed": character.speed,
            "hit_points": character.hit_points,
            "image_url": character.image_url,
            "copper_coins": character.copper_coins,
            "silver_coins": character.silver_coins,
            "electrum": character.electrum,
            "gold_coins": character.gold_coins,
            "platinum_coins": character.platinum_coins,
            "proficiency_bonus": character.proficiency_bonus,
            "armor_class": character.armor_class,
            "initiative": character.initiative,
            "speed": character.speed,
            # Include calculated modifiers
            "str_mod": character.str_mod,
            "dex_mod": character.dex_mod,
            "con_mod": character.con_mod,
            "int_mod": character.int_mod,
            "wis_mod": character.wis_mod,
            "cha_mod": character.cha_mod,
        }

        return jsonify({"character": character_data}), 200
    except Exception as e:
        print("Error fetching character details:", e)
        return jsonify({"error": "An error occurred while fetching character details"}), 500

from flask import Blueprint, request, jsonify
from app.models import Character
from app.database import db

character_routes = Blueprint('characters', __name__)

# Fetch character by ID
@character_routes.route('/<int:id>', methods=['GET'])
def get_character(id):
    character = Character.query.get(id)
    if not character:
        return jsonify({"error": "Character not found"}), 404

    return jsonify(character.to_dict())

# Update character coins
@character_routes.route('/<int:id>/coins', methods=['PUT'])
def update_character_coins(id):
    character = Character.query.get(id)
    if not character:
        return jsonify({"error": "Character not found"}), 404

    data = request.json
    character.platinum_coins = data.get('platinum_coins', character.platinum_coins)
    character.gold_coins = data.get('gold_coins', character.gold_coins)
    character.electrum = data.get('electrum', character.electrum)  # Handle electrum
    character.silver_coins = data.get('silver_coins', character.silver_coins)
    character.copper_coins = data.get('copper_coins', character.copper_coins)

    db.session.commit()
    return jsonify(character.to_dict())

from flask import Blueprint, jsonify
from app.models import Action

action_routes = Blueprint('actions', __name__)

# Get all actions for a character
@action_routes.route('/character/<int:character_id>', methods=['GET'])
def get_actions(character_id):
    print(f"Fetching actions for character_id: {character_id}")
    actions = Action.query.filter_by(character_id=character_id).all()
    return jsonify([action.to_dict() for action in actions])

# Add a new action
@action_routes.route('/', methods=['POST'])
def add_action():
    data = request.json
    new_action = Action(
        character_id=data['character_id'],
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_action)
    db.session.commit()
    return jsonify(new_action.to_dict()), 201

# Delete an action
@action_routes.route('/<int:action_id>', methods=['DELETE'])
def delete_action(action_id):
    action = Action.query.get(action_id)
    if not action:
        return jsonify({"error": "Action not found"}), 404
    db.session.delete(action)
    db.session.commit()
    return jsonify({"message": "Action deleted"}), 200

from flask import Blueprint, request, jsonify
from app.models import db, Spell

spell_routes = Blueprint('spells', __name__)

# Get all spells for a character
@spell_routes.route('/character/<int:character_id>', methods=['GET'])
def get_spells(character_id):
    spells = Spell.query.filter_by(character_id=character_id).all()
    return jsonify([spell.to_dict() for spell in spells])

# Add a new spell
@spell_routes.route('/', methods=['POST'])
def add_spell():
    data = request.json
    new_spell = Spell(
        character_id=data['character_id'],
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_spell)
    db.session.commit()
    return jsonify(new_spell.to_dict()), 201

# Delete a spell
@spell_routes.route('/<int:spell_id>', methods=['DELETE'])
def delete_spell(spell_id):
    spell = Spell.query.get(spell_id)
    if not spell:
        return jsonify({"error": "Spell not found"}), 404
    db.session.delete(spell)
    db.session.commit()
    return jsonify({"message": "Spell deleted"}), 200

from flask import Blueprint, request, jsonify
from app.models import db, Proficiency

proficiency_routes = Blueprint('proficiencies', __name__)

# Get all proficiencies for a character
@proficiency_routes.route('/character/<int:character_id>', methods=['GET'])
def get_proficiencies(character_id):
    print(f"Fetching proficiencies for character_id: {character_id}")
    proficiencies = Proficiency.query.filter_by(character_id=character_id).all()
    return jsonify([proficiency.to_dict() for proficiency in proficiencies])

# Add a new proficiency
@proficiency_routes.route('/', methods=['POST'])
def add_proficiency():
    data = request.json
    new_proficiency = Proficiency(
        character_id=data['character_id'],
        name=data['name'],
        description=data.get('description', '')
    )
    db.session.add(new_proficiency)
    db.session.commit()
    return jsonify(new_proficiency.to_dict()), 201

# Delete a proficiency
@proficiency_routes.route('/<int:proficiency_id>', methods=['DELETE'])
def delete_proficiency(proficiency_id):
    proficiency = Proficiency.query.get(proficiency_id)
    if not proficiency:
        return jsonify({"error": "Proficiency not found"}), 404
    db.session.delete(proficiency)
    db.session.commit()
    return jsonify({"message": "Proficiency deleted"}), 200

# routes.py
from flask import Blueprint, request, jsonify
from app.models import db, Other

others_bp = Blueprint('others', __name__)

# Get all "Others" for a character
@others_bp.route('/character/<int:character_id>', methods=['GET'])
def get_others(character_id):
    try:
        others = Other.query.filter_by(character_id=character_id).all()
        return jsonify([{
            'id': other.id,
            'character_id': other.character_id,
            'name': other.name,
            'description': other.description
        } for other in others])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new "Other"
@others_bp.route('/', methods=['POST'])
def add_other():
    try:
        data = request.get_json()
        new_other = Other(
            character_id=data['character_id'],
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(new_other)
        db.session.commit()
        return jsonify({
            'id': new_other.id,
            'character_id': new_other.character_id,
            'name': new_other.name,
            'description': new_other.description
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete an "Other"
@others_bp.route('/<int:id>', methods=['DELETE'])
def delete_other(id):
    try:
        other = Other.query.get(id)
        if not other:
            return jsonify({'error': 'Other not found'}), 404
        db.session.delete(other)
        db.session.commit()
        return jsonify({'message': 'Other deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import Blueprint, request, jsonify
from app.models import db, Inventory

inventory_routes = Blueprint('inventory', __name__)

# Get all inventory items for a character
@inventory_routes.route('/character/<int:character_id>', methods=['GET'])
def get_inventory(character_id):
    try:
        # Query the database for all inventory items belonging to the character
        items = Inventory.query.filter_by(character_id=character_id).all()
        # Return the items as a JSON response
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new inventory item
@inventory_routes.route('/', methods=['POST'])
def add_inventory_item():
    try:
        data = request.get_json()
        new_item = Inventory(
            character_id=data['character_id'],
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete an inventory item
@inventory_routes.route('/<int:id>', methods=['DELETE'])
def delete_inventory_item(id):
    try:
        item = Inventory.query.get(id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import Blueprint, request, jsonify
from app.models import db, Feature

features_bp = Blueprint('features', __name__)

# Get all features for a character
@features_bp.route('/character/<int:character_id>', methods=['GET'])
def get_features(character_id):
    try:
        features = Feature.query.filter_by(character_id=character_id).all()
        return jsonify([feature.to_dict() for feature in features])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new feature
@features_bp.route('/', methods=['POST'])
def add_feature():
    try:
        data = request.get_json()
        new_feature = Feature(
            character_id=data['character_id'],
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(new_feature)
        db.session.commit()
        return jsonify(new_feature.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete a feature
@features_bp.route('/<int:id>', methods=['DELETE'])
def delete_feature(id):
    try:
        feature = Feature.query.get(id)
        if not feature:
            return jsonify({'error': 'Feature not found'}), 404
        db.session.delete(feature)
        db.session.commit()
        return jsonify({'message': 'Feature deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route("/campaigns/<int:campaign_id>/users")
def get_campaign_users(campaign_id):
    campaign = Campaign.query.get(campaign_id)
    users = [user.to_dict() for user in campaign.players]  # Adjust as needed
    return jsonify({"users": users})

