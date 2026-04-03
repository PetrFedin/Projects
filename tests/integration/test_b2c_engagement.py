import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_b2c_engagement_api(client: AsyncClient):
    # 1. Create Box Subscription
    next_delivery = datetime.utcnow() + timedelta(days=30)
    resp = await client.post("/api/v1/wardrobe/subscriptions", json={
        "customer_id": "CUST-999",
        "plan_name": "Eco Monthly Box",
        "frequency_months": 1,
        "next_delivery_date": next_delivery.isoformat()
    })
    assert resp.status_code == 200
    assert resp.json()["plan_name"] == "Eco Monthly Box"
    
    # 2. Get Customer Subscriptions
    resp = await client.get("/api/v1/wardrobe/subscriptions/CUST-999")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
