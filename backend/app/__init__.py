from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from .database import db  # Import the db instance

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Use the Config class for configuration
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from .models.Users import User  # Import User model
        from .models.Characters import Character  # Import Character model
        from .models.Admins import Admin  # Import Admin model
        db.create_all()  # Create database tables

        from .routes import main  # Import and register blueprints
        app.register_blueprint(main)

    return app

app = create_app()
