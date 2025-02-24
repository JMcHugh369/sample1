import pytest
from app import app

def test_api():
    client = app.test_client()
    response = client.get('/api/test')
    assert response.status_code == 200
    assert response.json['message'] == 'Hello, World!'