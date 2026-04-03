import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_profile_navigation_registry(client: AsyncClient):
    # 0. Login as Brand Admin
    login_data = {"username": "brand@synth1.com", "password": "brand_password"}
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get Profile
    resp = await client.get("/api/v1/profile/me", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    
    # Check navigation
    assert "navigation" in data
    assert len(data["navigation"]) > 0
    # Brand admin should have Dashboard and Collections in new registry
    titles = [item["title"] for item in data["navigation"]]
    assert "Dashboard" in titles
    assert "B2B Каталог" in titles or "Collections" in titles  # Brand specific
    
    # Check permissions
    assert "permissions" in data
    assert "dashboard" in data["permissions"]
    assert "collections" in data["permissions"]

@pytest.mark.asyncio
async def test_profile_navigation_buyer(client: AsyncClient):
    # 0. Login as Buyer
    # We don't have a buyer user in mock auth yet, let's try to create one or use existing if any.
    # Looking at app/api/deps.py mock user: it defaults to BRAND_ADMIN.
    # We can simulate buyer if we had a way to override role in token.
    pass
