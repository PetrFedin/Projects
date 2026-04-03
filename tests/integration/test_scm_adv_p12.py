import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_scm_adv_p12(client: AsyncClient):
    # 1. Create T&A Entry
    planned_date = datetime.utcnow() + timedelta(days=30)
    resp = await client.post("/api/v1/supply-chain/ta", json={
        "order_id": "ORDER-999",
        "milestone_name": "bulk_fabric_approval",
        "planned_date": planned_date.isoformat(),
        "status": "pending"
    })
    assert resp.status_code == 200
    assert resp.json()["milestone_name"] == "bulk_fabric_approval"
    
    # 2. Get Order T&A
    resp = await client.get("/api/v1/supply-chain/ta/ORDER-999")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    
    # 3. Book Capacity
    resp = await client.post("/api/v1/supply-chain/bookings", json={
        "factory_id": "FACTORY-001",
        "brand_id": "BRAND-XYZ",
        "month": 6,
        "year": 2026,
        "units_reserved": 5000,
        "status": "confirmed"
    })
    assert resp.status_code == 200
    assert resp.json()["units_reserved"] == 5000
    
    # 4. Get Factory Bookings
    resp = await client.get("/api/v1/supply-chain/bookings/FACTORY-001?year=2026")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
