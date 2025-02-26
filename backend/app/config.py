import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')  # Default PostgreSQL port
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'Avengers#1')
    DB_NAME = os.getenv('DB_NAME', 'dnd_game_db')

    # Construct the database URI
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Print the configuration for debugging purposes
print(f"DB_HOST: {Config.DB_HOST}")
print(f"DB_PORT: {Config.DB_PORT}")
print(f"DB_USER: {Config.DB_USER}")
print(f"DB_PASSWORD: {Config.DB_PASSWORD}")
print(f"DB_NAME: {Config.DB_NAME}")