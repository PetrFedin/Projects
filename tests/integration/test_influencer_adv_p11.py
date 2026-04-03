import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_influencer_adv_p11(client: AsyncClient):
    # 1. Track Influencer Item
    resp = await client.post("/api/v1/marketing-crm/items", json={
        "influencer_id": 1,
        "sku_id": "SILK-DRESS-RED",
        "return_required": True,
        "return_status": "pending",
        "condition_notes": "Brand new condition"
    })
    assert resp.status_code == 200
    assert resp.json()["sku_id"] == "SILK-DRESS-RED"
    
    # 2. Get Influencer Items
    resp = await client.get("/api/v1/marketing-crm/items/1")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

    # 3. Report PR Sample Return
    out_date = datetime.utcnow()
    expected_return = out_date + timedelta(days=7)
    resp = await client.post("/api/v1/marketing-crm/pr-samples", json={
        "editorial_name": "Vogue Italy",
        "sku_id": "PREMIUM-COAT-001",
        "out_date": out_date.isoformat(),
        "expected_return_date": expected_return.isoformat(),
        "status": "out"
    })
    assert resp.status_code == 200
    assert resp.json()["editorial_name"] == "Vogue Italy"
    
    # 4. Get SKU PR Samples
    resp = await client.get("/api/v1/marketing-crm/pr-samples/PREMIUM-COAT-001")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
