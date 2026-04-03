import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_gift_registry_flow(client: AsyncClient):
    # 1. Create registry
    reg_payload = {
        "user_id": "user_123",
        "title": "My Birthday List",
        "items": [
            {"sku_id": "jacket_001", "status": "pending"},
            {"sku_id": "shirt_002", "status": "pending"}
        ]
    }
    resp = await client.post("/api/v1/retail/registries", json=reg_payload)
    assert resp.status_code == 200
    reg_id = resp.json()["id"]
    
    # 2. Purchase an item
    purchase_payload = {
        "registry_id": reg_id,
        "sku_id": "jacket_001",
        "purchaser_id": "friend_456"
    }
    resp = await client.post("/api/v1/retail/registries/purchase", json=purchase_payload)
    assert resp.status_code == 200
    
    # 3. Check status
    resp = await client.get(f"/api/v1/retail/registries/user_123")
    assert resp.status_code == 200
    registries = resp.json()
    assert len(registries) == 1
    items = registries[0]["items"]
    jacket_item = next(item for item in items if item["sku_id"] == "jacket_001")
    assert jacket_item["status"] == "purchased"
    assert jacket_item["purchaser_id"] == "friend_456"
    
    shirt_item = next(item for item in items if item["sku_id"] == "shirt_002")
    assert shirt_item["status"] == "pending"
