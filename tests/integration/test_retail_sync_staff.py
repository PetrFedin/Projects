import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_inventory_sync_api(client: AsyncClient):
    # 1. Create Sync Log
    resp = await client.post("/api/v1/retail/sync-logs", json={
        "external_system": "Shopify",
        "sync_type": "delta",
        "items_synced_count": 145,
        "status": "success"
    })
    assert resp.status_code == 200
    assert resp.json()["external_system"] == "Shopify"
    
    # 2. Get Sync Logs
    resp = await client.get("/api/v1/retail/sync-logs")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

@pytest.mark.asyncio
async def test_staff_shifts_api(client: AsyncClient):
    # 1. Create Shift
    start_time = datetime.utcnow()
    end_time = start_time + timedelta(hours=8)
    
    resp = await client.post("/api/v1/retail/shifts", json={
        "staff_id": "ST-123",
        "store_id": "SHOP-A",
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "status": "scheduled"
    })
    assert resp.status_code == 200
    assert resp.json()["staff_id"] == "ST-123"
    
    # 2. Get Staff Shifts
    resp = await client.get("/api/v1/retail/staff/ST-123/shifts")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
