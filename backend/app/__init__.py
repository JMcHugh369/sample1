from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        from .routes import main  # Import inside function to prevent circular import
        app.register_blueprint(main)  # Register the blueprint

        db.create_all()  # Create database tables for our data models

    return app
