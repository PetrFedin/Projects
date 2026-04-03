import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_b2c_personalization_p6(client: AsyncClient):
    # 1. Create Style DNA
    resp = await client.post("/api/v1/creative/dna", json={
        "customer_id": "CUST-VIP-1",
        "color_type": "Deep Winter",
        "silhouette": "Rectangle",
        "preferences_json": {"avoid": ["pastel"], "love": ["leather", "oversize"]}
    })
    assert resp.status_code == 200
    assert resp.json()["color_type"] == "Deep Winter"
    
    # 2. Get Style DNA
    resp = await client.get("/api/v1/creative/dna/CUST-VIP-1")
    assert resp.status_code == 200
    
    # 3. Schedule Consultation
    sched_at = datetime.utcnow() + timedelta(days=2)
    resp = await client.post("/api/v1/creative/consultations", json={
        "customer_id": "CUST-VIP-1",
        "stylist_id": "STY-PRO-1",
        "scheduled_at": sched_at.isoformat(),
        "meeting_link": "https://zoom.us/j/123456789"
    })
    assert resp.status_code == 200
    assert resp.json()["stylist_id"] == "STY-PRO-1"
    
    # 4. Get Customer Consultations
    resp = await client.get("/api/v1/creative/consultations/customer/CUST-VIP-1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
