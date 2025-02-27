from flask import Blueprint, request, jsonify
from .database import db
from .models import User  # Import the User model

main = Blueprint("main", __name__)  # Define the blueprint

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

@main.route("/add_user", methods=["POST"])
def add_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], discord=data['discord'])
    new_user.set_password(data['password'])  # Hash the password
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully!"}), 201