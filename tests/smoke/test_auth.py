import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_auth_signup(client: AsyncClient):
    payload = {
        "email": "architect@synth1.com",
        "password": "securepassword",
        "full_name": "Lead Architect"
    }
    # Note: Using params because the endpoint was defined with individual args
    response = await client.post("/api/v1/auth/signup", params=payload)
    assert response.status_code == 200
    assert response.json()["email"] == "architect@synth1.com"

@pytest.mark.asyncio
async def test_auth_login(client: AsyncClient):
    # Test login with form data
    login_data = {
        "username": "architect@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
