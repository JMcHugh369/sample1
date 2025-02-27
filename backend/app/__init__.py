from flask import Flask
from .config import Config
from .database import db  # Import the db instance

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    with app.app_context():
        from .models import User  # Import models
        db.create_all()  # Create database tables

        from .routes import main  # Import and register blueprints
        app.register_blueprint(main)

    return app

app = create_app()
