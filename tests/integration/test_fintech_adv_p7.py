import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_fintech_adv_api(client: AsyncClient):
    # 1. Create Factoring Request
    resp = await client.post("/api/v1/fintech/factoring", json={
        "invoice_id": 1,
        "partner_id": "BRAND-XYZ",
        "amount": 25000.0,
        "fee_percentage": 2.5,
        "ai_risk_score": 0.15,
        "status": "requested"
    })
    assert resp.status_code == 200
    assert resp.json()["amount"] == 25000.0
    
    # 2. Get Partner Factoring Requests
    resp = await client.get("/api/v1/fintech/factoring/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Cargo Insurance
    resp = await client.post("/api/v1/fintech/insurance", json={
        "order_id": "ORD-555",
        "policy_number": "POL-888-999",
        "insured_amount": 15000.0,
        "premium_cost": 75.0,
        "carrier_id": "FEDEX-001",
        "status": "active"
    })
    assert resp.status_code == 200
    assert resp.json()["policy_number"] == "POL-888-999"
    
    # 4. Get Order Insurance
    resp = await client.get("/api/v1/fintech/insurance/ORD-555")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 5. Create Brand Liquidity Snapshot
    resp = await client.post("/api/v1/fintech/liquidity", json={
        "brand_id": "BRAND-XYZ",
        "cash_on_hand": 150000.0,
        "accounts_receivable": 45000.0,
        "accounts_payable": 12000.0,
        "inventory_value": 85000.0
    })
    assert resp.status_code == 200
    assert resp.json()["brand_id"] == "BRAND-XYZ"
    
    # 6. Get Brand Liquidity
    resp = await client.get("/api/v1/fintech/liquidity/BRAND-XYZ")
    assert resp.status_code == 200
    assert resp.json()["cash_on_hand"] == 150000.0
