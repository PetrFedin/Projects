import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def test_client():
    return client

def test_health_check(test_client):
    response = test_client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "project": "Synth-1 Fashion OS"}

def test_api_v1_root(test_client):
    response = test_client.get("/api/v1/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Synth-1 API v1"}
