import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_circular_rental_api(client: AsyncClient):
    # 1. Create Subscription Plan
    resp = await client.post("/api/v1/circular/subscriptions", json={
        "name": "Premium",
        "price_monthly": 99.0,
        "items_limit": 5,
        "description": "Unlimited rentals for up to 5 items"
    })
    assert resp.status_code == 200
    assert resp.json()["name"] == "Premium"

    # 2. Create Circular Item
    resp = await client.post("/api/v1/circular/items", json={
        "sku_id": "SKU-CIRC-1",
        "serial_number": "SN-001",
        "current_condition": "excellent"
    })
    assert resp.status_code == 200
    assert resp.json()["serial_number"] == "SN-001"

    # 3. Create Rental Order
    due_date = datetime.utcnow() + timedelta(days=14)
    resp = await client.post("/api/v1/circular/rentals", json={
        "customer_id": "CUST-001",
        "sku_id": "SKU-CIRC-1",
        "due_date": due_date.isoformat(),
        "status": "rented"
    })
    assert resp.status_code == 200
    assert resp.json()["customer_id"] == "CUST-001"

    # 4. Get Customer Rentals
    resp = await client.get("/api/v1/circular/rentals/customer/CUST-001")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
