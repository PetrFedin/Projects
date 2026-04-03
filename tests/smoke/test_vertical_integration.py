import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_vertical_profile_integration(client: AsyncClient):
    # 1. Login as Brand Admin
    login_data = {
        "username": "brand_admin@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    headers = {"Authorization": f"Bearer {response.json()['access_token']}"}

    # 2. Check Profile Navigation
    response = await client.get("/api/v1/profile/me", headers=headers)
    assert response.status_code == 200
    nav = response.json()["data"]["navigation"]
    titles = [item["title"] for item in nav]
    assert "Wholesale Hub" in titles
    assert "Supply Chain" in titles
    assert "Retail Ops" in titles

    # 3. Create a Bottleneck (Logistics)
    bottleneck_data = {
        "location_id": "PORT-SHANGHAI",
        "severity": "high",
        "impact_description": "Congestion due to storm",
        "delay_days_est": 5
    }
    response = await client.post("/api/v1/logistics/bottlenecks", json=bottleneck_data, headers=headers)
    assert response.status_code == 200
    
    # 4. Create an Investment Campaign (Fintech)
    campaign_data = {
        "brand_id": "test_org_1",
        "title": "Summer Expansion Fund",
        "description": "Raising funds for new store",
        "target_amount": 100000.0,
        "equity_offered": 5.0,
        "end_date": "2026-12-31T23:59:59"
    }
    response = await client.post("/api/v1/fintech/campaigns", json=campaign_data, headers=headers)
    assert response.status_code == 200

    # 5. Login as Buyer
    buyer_login = {
        "username": "buyer@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=buyer_login)
    buyer_headers = {"Authorization": f"Bearer {response.json()['access_token']}"}

    # 6. Buyer check profile navigation
    response = await client.get("/api/v1/profile/me", headers=buyer_headers)
    assert response.status_code == 200
    buyer_nav = response.json()["data"]["navigation"]
    buyer_titles = [item["title"] for item in buyer_nav]
    assert "Marketplace" in buyer_titles
    assert "Finance" in buyer_titles
    assert "Supply Chain" not in buyer_titles # Buyer doesn't see SC ops

    # 7. Buyer sees the investment campaign
    response = await client.get("/api/v1/fintech/campaigns", headers=buyer_headers)
    assert response.status_code == 200
    campaigns = response.json()["data"]
    assert any(c["title"] == "Summer Expansion Fund" for c in campaigns)
