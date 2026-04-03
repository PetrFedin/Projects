import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_wholesale_features(client: AsyncClient):
    # 1. Test B2B Discounts
    resp = await client.post("/api/v1/wholesale/discounts", json={
        "tier_name": "Gold",
        "min_volume": 1000,
        "discount_percentage": 15.0
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/wholesale/discounts")
    assert resp.status_code == 200
    assert any(d["tier_name"] == "Gold" for d in resp.json())

    # 2. Test MOQ Settings
    resp = await client.post("/api/v1/wholesale/moq", json={
        "sku_id": "SKU-MOQ-1",
        "min_units": 50,
        "min_amount": 500.0
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/wholesale/moq/SKU-MOQ-1")
    assert resp.status_code == 200
    assert resp.json()["min_units"] == 50

    # 3. Test Credit Limits
    resp = await client.post("/api/v1/wholesale/credit-limits", json={
        "partner_id": "PARTNER-1",
        "total_limit": 50000.0,
        "used_amount": 0.0
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/wholesale/credit-limits/PARTNER-1")
    assert resp.status_code == 200
    assert resp.json()["total_limit"] == 50000.0

    # 4. Test Seasonal Credits
    expiry = (datetime.utcnow() + timedelta(days=90)).isoformat()
    resp = await client.post("/api/v1/wholesale/seasonal-credits", json={
        "partner_id": "PARTNER-1",
        "season": "SS26",
        "credit_amount": 10000.0,
        "expiry_date": expiry
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/wholesale/seasonal-credits/PARTNER-1/SS26")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_fintech_splits(client: AsyncClient):
    # Test Transaction Split
    resp = await client.post("/api/v1/fintech/splits", json={
        "transaction_id": "TX-999",
        "brand_share": 60.0,
        "factory_share": 30.0,
        "logistics_share": 5.0,
        "platform_fee": 5.0
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/fintech/splits/TX-999")
    assert resp.status_code == 200
    assert resp.json()["brand_share"] == 60.0
