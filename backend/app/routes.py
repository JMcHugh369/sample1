'''
    Note(s) for myself:
        - Test every endpoint before frontend integration
        
    This file:
        - Contains API endpoints for testing and 
            - User Management
            - Admin Management
            - DM Management
'''

from flask import Blueprint, request, jsonify
from .database import db
from .models import User, Admin, Character, Campaign  # Import the User, Admin, Character, and Campaign models

main = Blueprint("main", __name__)  # Define the blueprint

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

'''
    User management
'''

@main.route("/add_user", methods=["POST"])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    discord = data.get('discord')
    password = data.get('password')
    
    new_user = User(username=username, email=email, discord=discord, password=password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@main.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found!"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully!"}), 200

@main.route("/get_user/<identifier>", methods=["GET"])
def get_user(identifier):
    if identifier.isdigit():
        user = User.query.get(int(identifier))
    else:
        user = User.query.filter(
            (User.username == identifier) |
            (User.email == identifier) |
            (User.discord == identifier)
        ).first()
    
    if user is None:
        return jsonify({"message": "User not found!"}), 404
    
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "discord": user.discord
    }
    return jsonify(user_data), 200

@main.route("/update_user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found!"}), 404
    
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.discord = data.get('discord', user.discord)
    if 'password' in data:
        user.set_password(data['password'])  # Set the new password
    
    db.session.commit()
    return jsonify({"message": "User updated successfully!"}), 200

@main.route("/list_users", methods=["GET"])
def list_users():
    users = User.query.all()
    users_data = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "discord": user.discord
        } for user in users
    ]
    return jsonify(users_data), 200

@main.route('/authenticate_user', methods=['POST'])
def authenticate_user():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@main.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user is None:
        return jsonify({"message": "User not found with the given email!"}), 404
    
    user.password = data['new_password']
    db.session.commit()
    return jsonify({"message": "Password reset successfully!"}), 200

@main.route('/get_user_id', methods=['GET'])
def get_user_id():
    username = request.args.get('username')
    if not username:
        return jsonify({'success': False, 'message': 'Username is required'}), 400

    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'success': True, 'user_id': user.id}), 200
    else:
        return jsonify({'success': False, 'message': 'User not found'}), 404

'''
    Admin management
'''

@main.route("/add_admin", methods=["POST"])
def create_admin():
    data = request.get_json()
    new_admin = Admin(username=data['username'], email=data['email'])
    new_admin.set_password(data['password'])  # Set the password
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Admin created successfully!"}), 201

@main.route("/delete_admin/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin = Admin.query.get(admin_id)
    if admin is None:
        return jsonify({"message": "Admin not found!"}), 404
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"message": "Admin deleted successfully!"}), 200

@main.route("/get_admin/<identifier>", methods=["GET"])
def get_admin(identifier):
    if identifier.isdigit():
        admin = Admin.query.get(int(identifier))
    else:
        admin = Admin.query.filter(
            (Admin.username == identifier) |
            (Admin.email == identifier)
        ).first()
    
    if admin is None:
        return jsonify({"message": "Admin not found!"}), 404
    
    admin_data = {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email
    }
    return jsonify(admin_data), 200

@main.route("/update_admin/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    data = request.get_json()
    admin = Admin.query.get(admin_id)
    if admin is None:
        return jsonify({"message": "Admin not found!"}), 404
    
    admin.username = data.get('username', admin.username)
    admin.email = data.get('email', admin.email)
    if 'password' in data:
        admin.set_password(data['password'])  # Set the new password
    
    db.session.commit()
    return jsonify({"message": "Admin updated successfully!"}), 200

@main.route("/list_admins", methods=["GET"])
def list_admins():
    admins = Admin.query.all()
    admins_data = [
        {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email
        } for admin in admins
    ]
    return jsonify(admins_data), 200

@main.route("/authenticate_admin", methods=["POST"])
def authenticate_admin():
    data = request.get_json()
    admin = Admin.query.filter_by(username=data['username']).first()
    if admin and admin.check_password(data['password']):
        return jsonify({"message": "Authentication successful!"}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@main.route("/reset_admin_password", methods=["POST"])
def reset_admin_password():
    data = request.get_json()
    admin = Admin.query.filter_by(email=data['email']).first()
    if admin is None:
        return jsonify({"message": "Admin not found with the given email!"}), 404
    
    admin.password = data['new_password']
    db.session.commit()
    return jsonify({"message": "Password reset successfully!"}), 200

'''
    DM Management
'''

@main.route("/get_dm/<int:dm_id>", methods=["GET"])
def get_dm(dm_id):
    dm = DM.query.get(dm_id)
    
    if dm is None:
        return jsonify({"message": "DM not found!"}), 404
    
    dm_data = {
        "id": dm.id,
        "user_id": dm.user_id
    }
    return jsonify(dm_data), 200

@main.route("/add_dm", methods=["POST"])
def add_dm():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if user is None:
        return jsonify({"message": "User not found!"}), 404
    new_dm = DM(user_id=data['user_id'])
    db.session.add(new_dm)
    db.session.commit()
    return jsonify({"message": "DM added successfully!"}), 201

@main.route("/delete_dm/<int:dm_id>", methods=["DELETE"])
def delete_dm(dm_id):
    dm = DM.query.get(dm_id)
    if dm is None:
        return jsonify({"message": "DM not found!"}), 404
    db.session.delete(dm)
    db.session.commit()
    return jsonify({"message": "DM deleted successfully!"}), 200

@main.route("/add_character", methods=["POST"])
def add_character():
    print("Received request to /add_character")  # Debug log
    data = request.get_json()
    print("Request data:", data)  # Debug log
    try:
        # Validate required fields
        required_fields = ['name', 'race', 'character_class', 'username']
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Missing required field: {field}")

        # Retrieve user_id based on the username
        username = data.get('username')
        user = User.query.filter_by(username=username).first()
        if not user:
            raise ValueError(f"User with username '{username}' not found")

        # Create a new character
        new_character = Character(
            name=data.get('name'),
            race=data.get('race'),
            character_class=data.get('character_class'),
            level=data.get('level', 1),
            background=data.get('background'),
            alignment=data.get('alignment'),
            strength=data.get('strength', 10),
            dexterity=data.get('dexterity', 10),
            constitution=data.get('constitution', 10),
            intelligence=data.get('intelligence', 10),
            wisdom=data.get('wisdom', 10),
            charisma=data.get('charisma', 10),
            armor_class=data.get('armor_class', 10),
            hit_points=data.get('hit_points', 10),
            speed=data.get('speed', 30),
            proficiency_bonus=data.get('proficiency_bonus', 2),
            skills=data.get('skills'),
            saving_throws=data.get('saving_throws'),
            equipment=data.get('equipment'),
            features=data.get('features'),
            spells=data.get('spells'),
            languages=data.get('languages'),
            notes=data.get('notes'),
            copper_coins=data.get('copper_coins', 0),
            silver_coins=data.get('silver_coins', 0),
            gold_coins=data.get('gold_coins', 0),
            platinum_coins=data.get('platinum_coins', 0),
            inventory=data.get('inventory'),
            total_weight=data.get('total_weight', 0.0),
            user_id=user.id  # Use the retrieved user_id
        )
        db.session.add(new_character)
        db.session.commit()
        print("Character added successfully:", new_character)  # Debug log
        return jsonify({"success": True, "message": "Character added successfully!"}), 201
    except ValueError as ve:
        print("Validation error:", ve)  # Debug log
        return jsonify({"success": False, "message": str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        print("Error saving character:", e)  # Debug log
        return jsonify({"success": False, "message": "Internal server error"}), 500

@main.route("/get_characters", methods=["GET"])
def get_characters():
    print("Received request to /get_characters")  # Debug log
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"success": False, "message": "Missing required field: user_id"}), 400

    try:
        characters = Character.query.filter_by(user_id=user_id).all()
        characters_data = [
            {
                "id": character.id,
                "name": character.name,
                "race": character.race,
                "character_class": character.character_class,
                "level": character.level,
                "background": character.background,
                "alignment": character.alignment,
            }
            for character in characters
        ]
        print("Characters retrieved:", characters_data)  # Debug log
        return jsonify({"success": True, "characters": characters_data}), 200
    except Exception as e:
        print("Error retrieving characters:", e)  # Debug log
        return jsonify({"success": False, "message": "Internal server error"}), 500

@main.route("/delete_character/<int:id>", methods=["DELETE"])
def delete_character(id):
    print("Received request to delete character:", id)  # Debug log
    try:
        character = Character.query.get(id)
        if not character:
            return jsonify({"success": False, "message": "Character not found"}), 404

        db.session.delete(character)
        db.session.commit()
        print("Character deleted successfully:", character)  # Debug log
        return jsonify({"success": True, "message": "Character deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print("Error deleting character:", e)  # Debug log
        return jsonify({"success": False, "message": "Internal server error"}), 500

@main.route("/add_campaign", methods=["POST"])
def add_campaign():
    print("Received request to /add_campaign")  # Debug log
    data = request.get_json()
    print("Request data:", data)  # Debug log

    try:
        # Validate required fields
        required_fields = ['name', 'dm_username']
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Missing required field: {field}")

        # Check if a campaign with the same name already exists
        existing_campaign = Campaign.query.filter_by(name=data.get('name')).first()
        if existing_campaign:
            raise ValueError(f"A campaign with the name '{data.get('name')}' already exists")

        # Retrieve dm_id based on the dm_username
        dm_username = data.get('dm_username')
        dm = User.query.filter_by(username=dm_username).first()
        if not dm:
            raise ValueError(f"User with username '{dm_username}' not found")

        # Create a new campaign
        new_campaign = Campaign(
            name=data.get('name'),
            dm_id=dm.id
        )
        db.session.add(new_campaign)
        db.session.commit()
        print("Campaign created successfully:", new_campaign)  # Debug log
        return jsonify({
            "success": True,
            "message": "Campaign created successfully!",
            "campaign": {
                "id": new_campaign.id,
                "name": new_campaign.name,
                "access_code": new_campaign.access_code
            }
        }), 201
    except ValueError as ve:
        print("Validation error:", ve)  # Debug log
        return jsonify({"success": False, "message": str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        print("Error saving campaign to database:", e)  # Debug log
        return jsonify({"success": False, "message": "Internal server error"}), 500

@main.route("/join_campaign", methods=["POST"])
def join_campaign():
    print("Received request to /join_campaign")  # Debug log
    data = request.get_json()
    print("Request data:", data)  # Debug log

    try:
        # Validate required fields
        required_fields = ['campaignName', 'accessCode', 'username']
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Missing required field: {field}")

        # Retrieve the campaign based on name and access code
        campaign = Campaign.query.filter_by(name=data.get('campaignName'), access_code=data.get('accessCode')).first()
        if not campaign:
            raise ValueError("Invalid campaign name or access code")

        # Retrieve the user based on username
        user = User.query.filter_by(username=data.get('username')).first()
        if not user:
            raise ValueError(f"User with username '{data.get('username')}' not found")

        # Add the user to the campaign's players
        if user in campaign.players:
            raise ValueError("User is already a member of this campaign")
        campaign.players.append(user)
        db.session.commit()

        print(f"User {user.username} successfully joined campaign {campaign.name}")  # Debug log
        return jsonify({"success": True, "message": "Successfully joined the campaign!"}), 200
    except ValueError as ve:
        print("Validation error:", ve)  # Debug log
        return jsonify({"success": False, "message": str(ve)}), 400
    except Exception as e:
        db.session.rollback()
        print("Error adding user to campaign:", e)  # Debug log
        return jsonify({"success": False, "message": "Internal server error"}), 500
