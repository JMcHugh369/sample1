import psycopg2
from flask import current_app

def connect_db():
    conn = psycopg2.connect(
        dbname=current_app.config['DB_NAME'],
        user=current_app.config['DB_USER'],
        password=current_app.config['Avengers#1'],
        host=current_app.config['PostgreSQL'],
        port=current_app.config['5432']
    )
    return conn