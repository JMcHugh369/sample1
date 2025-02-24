from app import app
from flask import jsonify

@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify(message="Hello, World!")