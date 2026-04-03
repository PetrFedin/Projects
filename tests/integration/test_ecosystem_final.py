import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_creative_flow(client: AsyncClient):
    # 1. Generate Lookbook
    payload = {
        "brand_id": "BRAND_X",
        "skus": ["SKU_1", "SKU_2"],
        "season": "Winter 2026",
        "style_context": "Avant-garde"
    }
    resp = await client.post("/api/v1/creative/generate", json=payload)
    assert resp.status_code == 200
    lb_id = resp.json()["id"]
    
    # 2. Publish
    resp = await client.patch(f"/api/v1/creative/{lb_id}/publish")
    assert resp.status_code == 200
    
    # 3. List
    resp = await client.get("/api/v1/creative/?brand_id=BRAND_X")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_circular_flow(client: AsyncClient):
    # 1. List material
    payload = {
        "supplier_id": "SUPP_Y",
        "material_name": "Silk Leftovers",
        "quantity": 50.5,
        "unit": "meters",
        "price_per_unit": 10.0,
        "composition": "100% Silk"
    }
    resp = await client.post("/api/v1/circular/materials", json=payload)
    assert resp.status_code == 200
    
    # 2. Search
    resp = await client.get("/api/v1/circular/materials?name=Silk")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_custom_flow(client: AsyncClient):
    # 1. Place custom order
    payload = {
        "customer_id": "CUST_Z",
        "sku_base": "BLAZER_01",
        "customizations_json": {"buttons": "gold"},
        "measurements_json": {"chest": 95}
    }
    resp = await client.post("/api/v1/custom/orders", json=payload)
    assert resp.status_code == 200
    
    # 2. Check orders
    resp = await client.get("/api/v1/custom/orders/CUST_Z")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_wardrobe_flow(client: AsyncClient):
    # 1. Add item
    payload = {
        "customer_id": "CUST_Z",
        "sku_id": "BLAZER_01",
        "condition": "new"
    }
    resp = await client.post("/api/v1/wardrobe/items", json=payload)
    assert resp.status_code == 200
    
    # 2. Suggest outfit
    req = {
        "customer_id": "CUST_Z",
        "occasion": "wedding",
        "weather_context": "Warm and breezy"
    }
    resp = await client.post("/api/v1/wardrobe/suggest-outfit", json=req)
    assert resp.status_code == 200
    assert "recommendation" in resp.json()
