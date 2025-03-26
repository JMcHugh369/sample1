import os
from flask_cors import CORS

# Ensure DB_NAME is set in the environment
if not os.getenv('DB_NAME'):
    os.environ['DB_NAME'] = 'dnd_game_db'

from app import create_app

app = create_app()
CORS(app)  # Enable CORS for all routes

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Ensure port is 5001
