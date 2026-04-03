import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_dam_demand_forecast_integration(client: AsyncClient):
    # 0. Login to get token
    login_data = {
        "username": "brand@synth1.com",
        "password": "brand_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create a dummy media asset
    asset_payload = {
        "title": "Cyber Parka Lookbook",
        "asset_type": "image",
        "original_url": "http://example.com/parka.jpg",
        "organization_id": "brand_org_1"
    }
    resp = await client.post("/api/v1/dam/", json=asset_payload, headers=headers)
    assert resp.status_code == 200
    asset_id = resp.json()["data"]["id"]
    
    # 2. Run Visual Analytics
    resp = await client.post(f"/api/v1/dam/{asset_id}/analyze-trends", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["trend_score"] == 1.45
    
    # 3. Call demand forecast with this asset
    forecast_payload = {
        "sku_id": "SKU_PARKA_001",
        "season": "FW26",
        "media_asset_id": asset_id
    }
    
    resp = await client.post("/api/v1/analytics/demand-forecast", json=forecast_payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    
    assert data["sku_id"] == "SKU_PARKA_001"
    # base_demand(150) * visual_trend_score(1.45) = 217
    assert data["predicted_demand"] == 217
    assert data["factors"]["visual_appeal_score"] == 1.45
