import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_bopis_flow(client: AsyncClient):
    # 1. Create order
    order_payload = {
        "order_id": "ORD_001",
        "customer_id": "cust_123",
        "store_id": "STORE_MAIN",
        "items": {"jacket_001": 1},
        "pickup_code": "SECRET_99"
    }
    resp = await client.post("/api/v1/logistics/orders", json=order_payload)
    assert resp.status_code == 200
    
    # 2. Mark as ready
    resp = await client.patch(f"/api/v1/logistics/orders/ORD_001/ready")
    assert resp.status_code == 200
    assert resp.json()["pickup_code"] == "SECRET_99"
    
    # 3. Verify pickup
    pickup_payload = {
        "pickup_code": "SECRET_99",
        "store_id": "STORE_MAIN"
    }
    resp = await client.post("/api/v1/logistics/pickup", json=pickup_payload)
    assert resp.status_code == 200
    
    # 4. Check status
    resp = await client.get("/api/v1/logistics/orders")
    assert resp.status_code == 200
    orders = resp.json()
    assert len(orders) == 1
    assert orders[0]["status"] == "picked_up"
