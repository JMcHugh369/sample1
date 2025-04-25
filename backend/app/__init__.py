from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .database import db
import os
from app.routes import (
    action_routes,
    main,
    set_upload_folder,
    spell_routes,
    proficiency_routes,
    others_bp,
    inventory_routes,  # Ensure this is correctly imported
    features_bp,
)

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+pg8000://postgres:Avengers#1@localhost/sample2"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = "uploads/"

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from .models import User  # Import models
        db.create_all()  # Create database tables

        # Register blueprints
        app.register_blueprint(main)

        UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
        current_app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

        # Register the actions blueprint
        app.register_blueprint(action_routes, url_prefix='/actions')

        # Register the spells blueprint
        app.register_blueprint(spell_routes, url_prefix='/spells')

        # Register the proficiencies blueprint
        app.register_blueprint(proficiency_routes, url_prefix='/proficiencies')

        # Register the "Others" blueprint
        app.register_blueprint(others_bp, url_prefix='/others')

        # Register the inventory blueprint
        app.register_blueprint(inventory_routes, url_prefix='/inventory')

        # Register the features blueprint
        app.register_blueprint(features_bp, url_prefix='/features')

        # Set the upload folder
        set_upload_folder(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)