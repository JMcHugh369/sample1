import psycopg2
from flask import current_app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def connect_db():
    conn = psycopg2.connect(
        dbname=current_app.config['dnd_game_db'],
        user=current_app.config['postgres'],
        password=current_app.config['Avengers#1'],
        host=current_app.config['PostgreSQL'],
        port=current_app.config['5432']
    )
    return conn