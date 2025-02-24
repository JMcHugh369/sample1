from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from .config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config.from_object(Config)

db = SQLAlchemy(app)  # Initialize SQLAlchemy

@app.route('/')
def home():
    return "Hello, Flask is running!"

@app.route('/api/test', methods=['GET'])
def api_test():
    return jsonify({"message": "This is a test response from the backend!"})

@app.route('/api/db-test', methods=['GET'])
def db_test():
    try:
        # Perform a simple query to test the database connection
        with app.app_context():
            Session = sessionmaker(bind=db.engine)
            session = Session()
            result = session.execute(text("SELECT 1"))
            session.close()
        return jsonify({"message": "Database connection successful!"})
    except Exception as e:
        return jsonify({"message": f"Database connection failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)