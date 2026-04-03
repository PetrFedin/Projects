import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_rfq_flow(client: AsyncClient):
    # 1. Create RFQ
    resp = await client.post("/api/v1/supply-chain/rfqs", json={
        "material_name": "Organic Denim 12oz",
        "target_quantity": 5000.0,
        "unit": "meters"
    })
    assert resp.status_code == 200
    rfq_id = resp.json()["id"]
    assert resp.json()["material_name"] == "Organic Denim 12oz"
    
    # 2. Add Quotes
    resp = await client.post("/api/v1/supply-chain/quotes", json={
        "rfq_id": rfq_id,
        "vendor_id": "V-001",
        "price_per_unit": 4.5,
        "lead_time_days": 30
    })
    assert resp.status_code == 200
    assert resp.json()["vendor_id"] == "V-001"
    
    resp = await client.post("/api/v1/supply-chain/quotes", json={
        "rfq_id": rfq_id,
        "vendor_id": "V-002",
        "price_per_unit": 4.2,
        "lead_time_days": 45
    })
    assert resp.status_code == 200
    
    # 3. Get RFQ Quotes
    resp = await client.get(f"/api/v1/supply-chain/rfqs/{rfq_id}/quotes")
    assert resp.status_code == 200
    assert len(resp.json()) == 2
