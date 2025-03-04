
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
from .models import User, Admin  # Import the User model
from werkzeug.security import generate_password_hash

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
    new_user = User(username=data['username'], email=data['email'], discord=data['discord'])
    new_user.set_password(data['password'])  # Hash the password
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully!"}), 201

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
        user.set_password(data['password'])  # Hash the new password
    
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

@main.route("/authenticate_user", methods=["POST"])
def authenticate_user():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({"message": "Authentication successful!"}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@main.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user is None:
        return jsonify({"message": "User not found with the given email!"}), 404
    
    new_password = generate_password_hash(data['new_password'])
    user.password_hash = new_password
    db.session.commit()
    return jsonify({"message": "Password reset successfully!"}), 200

'''
    Admin management
'''

@main.route("/add_admin", methods=["POST"])
def create_admin():
    data = request.get_json()
    new_admin = Admin(username=data['username'], email=data['email'])
    new_admin.set_password(data['password'])  # Hash the password
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
    
    if user is None:
        return jsonify({"message": "Admin not found!"}), 404
    
    admin_data = {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email
    }
    
@main.route("/update_admin/<int:user_id>", methods=["PUT"])
def update_admin(admin_id):
    data = request.get_json()
    admin = Admin.query.get(admin_id)
    if admin is None:
        return jsonify({"message": "Admin not found!"}), 404
    
    admin.username = data.get('username', admin.username)
    admin.email = data.get('email', admin.email)
    if 'password' in data:
        user.set_password(data['password'])  # Hash the new password
        
@main.route("/list_admins", methods=["GET"])
def list_admins():
    admins = Admin.query.all()
    admin_data = [
        {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email
        } for admin in admins
    ]
    return jsonify(admin_data), 200

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
    
    new_password = generate_password_hash(data['new_password'])
    admin.password_hash = new_password
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
