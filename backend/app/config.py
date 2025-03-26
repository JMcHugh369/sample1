import os

class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')
    DB_NAME = os.getenv('DB_NAME', 'dnd_game_db')  # Ensure the correct database name

    SQLALCHEMY_DATABASE_URI = f"postgresql+pg8000://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"  # Use sample1
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    print("Environment DB_NAME:", os.getenv('DB_NAME'))  # Debug the environment variable
    print("Database URI:", SQLALCHEMY_DATABASE_URI)  # Debug the final database URI