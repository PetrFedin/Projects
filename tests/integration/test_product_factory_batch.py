import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_product_lifecycle_features(client: AsyncClient):
    # 1. Test Grading
    resp = await client.post("/api/v1/product/grading", json={
        "sku_id": "SKU-PROD-1",
        "base_size": "M",
        "increments_json": {"L": {"chest": 2, "length": 1}}
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/product/grading/SKU-PROD-1")
    assert resp.status_code == 200
    assert resp.json()["base_size"] == "M"

    # 2. Test 3D Assets
    resp = await client.post("/api/v1/product/assets-3d", json={
        "sku_id": "SKU-PROD-1",
        "clo3d_url": "https://clo3d.com/share/123",
        "file_format": "glb"
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/product/assets-3d/SKU-PROD-1")
    assert resp.status_code == 200
    assert "clo3d.com" in resp.json()["clo3d_url"]

    # 3. Test Samples
    resp = await client.post("/api/v1/product/samples", json={
        "sku_id": "SKU-PROD-1",
        "factory_id": "FAC-001",
        "sample_type": "Prototype 1"
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/product/samples/SKU-PROD-1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_factory_scheduling(client: AsyncClient):
    # Test Production Schedule
    resp = await client.post("/api/v1/factory/schedules", json={
        "order_id": "ORD-GANTT-1",
        "gantt_data_json": {"stages": [{"name": "Cutting", "days": 3}]},
        "capacity_usage_percent": 85.0
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/factory/schedules/ORD-GANTT-1")
    assert resp.status_code == 200
    assert resp.json()["capacity_usage_percent"] == 85.0
