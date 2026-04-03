import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_collection_workflow(client: AsyncClient, brand_token_headers):
    # 1. Create a drop
    drop_payload = {
        "season": "FW2026",
        "drop_name": "Main Drop",
        "scheduled_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "sku_list_json": {"skus": ["SKU-001", "SKU-002"]},
        "status": "planned"
    }
    response = await client.post("/api/v1/collections/drops", json=drop_payload, headers=brand_token_headers)
    assert response.status_code == 200
    
    # 2. Get drops
    response = await client.get("/api/v1/collections/drops?season=FW2026", headers=brand_token_headers)
    assert response.status_code == 200
    assert len(response.json()["data"]) >= 1

@pytest.mark.asyncio
async def test_merchandise_grid_workflow(client: AsyncClient, brand_token_headers):
    season = "SS2026"
    
    # 1. Save grid
    grid_payload = {
        "total_budget": 50000.0,
        "category_split_json": {"tops": 40, "bottoms": 30, "outerwear": 30},
        "target_units": 1000
    }
    response = await client.post(f"/api/v1/collections/merchandise-grid/{season}", json=grid_payload, headers=brand_token_headers)
    assert response.status_code == 200
    
    # 2. Get grid
    response = await client.get(f"/api/v1/collections/merchandise-grid/{season}", headers=brand_token_headers)
    assert response.status_code == 200
    assert response.json()["data"]["total_budget"] == 50000.0
