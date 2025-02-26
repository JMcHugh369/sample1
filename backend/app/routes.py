from flask import Blueprint, request, jsonify

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
