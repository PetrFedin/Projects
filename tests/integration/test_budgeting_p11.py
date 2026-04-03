import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_budgeting_p11(client: AsyncClient):
    # 1. Create Budget Limit
    resp = await client.post("/api/v1/fintech/budgets", json={
        "brand_id": "BRAND-XYZ",
        "season": "SS2026",
        "budget_type": "raw_material",
        "limit_amount": 250000.0,
        "spent_amount": 45000.0,
        "currency": "USD"
    })
    assert resp.status_code == 200
    assert resp.json()["budget_type"] == "raw_material"
    
    # 2. Get Brand Budgets
    resp = await client.get("/api/v1/fintech/budgets/BRAND-XYZ?season=SS2026")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert any(b["budget_type"] == "raw_material" for b in resp.json())
