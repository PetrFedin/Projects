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
    body = response.json()
    assert body.get("project") == "Synth-1 Fashion OS"
    assert body.get("status") in ("ok", "degraded")
    assert "db" in body

def test_api_v1_root(test_client):
    response = test_client.get("/api/v1/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Synth-1 API v1"}
