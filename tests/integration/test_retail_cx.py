import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_retail_cx_api(client: AsyncClient):
    # 1. Create Repair Request
    resp = await client.post("/api/v1/retail/repairs", json={
        "customer_id": "CUST-001",
        "sku_id": "JACKET-001",
        "description": "Zipper replacement",
        "repair_cost": 25.0
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "submitted"
    
    # 2. Get Customer Repairs
    resp = await client.get("/api/v1/retail/repairs/CUST-001")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Fitting Room Booking
    booking_time = datetime.utcnow() + timedelta(days=1)
    resp = await client.post("/api/v1/retail/bookings", json={
        "customer_id": "CUST-001",
        "store_id": "STORE-MAIN",
        "booking_time": booking_time.isoformat(),
        "sku_ids_json": {"JEANS-32": 1, "TSHIRT-M": 1}
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "confirmed"
    
    # 4. Get Store Bookings
    resp = await client.get("/api/v1/retail/bookings/STORE-MAIN")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
