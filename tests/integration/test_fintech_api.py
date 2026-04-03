import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_investment_flow(client: AsyncClient):
    # 1. Create campaign
    end_date = (datetime.utcnow() + timedelta(days=30)).isoformat()
    camp_payload = {
        "brand_id": "BRAND_L",
        "title": "Summer Drop 2026",
        "description": "Investing in high-end summer collection",
        "target_amount": 100000.0,
        "equity_offered": 5.0,
        "end_date": end_date
    }
    resp = await client.post("/api/v1/fintech/campaigns", json=camp_payload)
    assert resp.status_code == 200
    camp_id = resp.json()["id"]
    
    # 2. Invest
    invest_payload = {
        "campaign_id": camp_id,
        "investor_id": "investor_001",
        "amount": 5000.0
    }
    resp = await client.post("/api/v1/fintech/invest", json=invest_payload)
    assert resp.status_code == 200
    
    # 3. Check status
    resp = await client.get("/api/v1/fintech/campaigns")
    assert resp.status_code == 200
    campaigns = resp.json()
    assert len(campaigns) == 1
    assert campaigns[0]["current_amount"] == 5000.0
    
    # 4. Check investor investments
    resp = await client.get("/api/v1/fintech/investments/investor_001")
    assert resp.status_code == 200
    investments = resp.json()
    assert len(investments) == 1
    assert investments[0]["amount"] == 5000.0
