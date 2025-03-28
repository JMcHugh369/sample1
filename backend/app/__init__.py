from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from .database import db  # Import the db instance

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost/dnd_game_db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from .models import User  # Import models
        db.create_all()  # Create database tables

        from .routes import main  # Import and register blueprints
        app.register_blueprint(main)

    return app

app = create_app()
