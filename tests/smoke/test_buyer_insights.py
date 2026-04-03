import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_buyer_personalized_insights(client: AsyncClient):
    # 0. Login as buyer
    login_data = {
        "username": "buyer@synth1.com",
        "password": "buyer_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get insights
    resp = await client.get("/api/v1/buyer/insights", headers=headers)
    assert resp.status_code == 200
    data = resp.json()["data"]
    
    assert "summary" in data
    assert "top_picks" in data
    assert len(data["top_picks"]) > 0
    assert "market_trends" in data
    assert "action_items" in data

@pytest.mark.asyncio
async def test_buyer_insights_unauthorized(client: AsyncClient):
    # Login as brand
    login_data = {
        "username": "brand@synth1.com",
        "password": "brand_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Try to get buyer insights
    resp = await client.get("/api/v1/buyer/insights", headers=headers)
    assert resp.status_code == 403
