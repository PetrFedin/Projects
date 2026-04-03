import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_wholesale_expansion_p6(client: AsyncClient):
    # 1. Create BNPL Plan
    due_date = datetime.utcnow() + timedelta(days=60)
    resp = await client.post("/api/v1/wholesale/bnpl", json={
        "partner_id": "BUYER-ABC",
        "order_id": "ORD-BNPL-001",
        "amount": 5000.0,
        "terms_days": 60,
        "due_date": due_date.isoformat()
    })
    assert resp.status_code == 200
    assert resp.json()["terms_days"] == 60
    
    # 2. Get Partner BNPL
    resp = await client.get("/api/v1/wholesale/bnpl/BUYER-ABC")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Exclusivity
    resp = await client.post("/api/v1/wholesale/exclusivity", json={
        "partner_id": "BUYER-ABC",
        "region": "Scandinavia",
        "exclusive_categories_json": ["Luxury Denim", "Premium Knitwear"]
    })
    assert resp.status_code == 200
    assert resp.json()["region"] == "Scandinavia"
    
    # 4. Get Exclusivity
    resp = await client.get("/api/v1/wholesale/exclusivity/BUYER-ABC")
    assert resp.status_code == 200
    assert "Luxury Denim" in resp.json()["exclusive_categories_json"]
