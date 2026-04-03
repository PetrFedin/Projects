import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_retail_new_features(client: AsyncClient):
    # 1. Test Replenishment
    resp = await client.post("/api/v1/retail/replenishment", json={
        "store_id": "STORE-A",
        "sku_id": "SKU-LOW",
        "quantity": 20,
        "priority": "high"
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/retail/replenishment/STORE-A")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 2. Test Staff Training
    resp = await client.post("/api/v1/retail/staff/training", json={
        "staff_id": "STAFF-001",
        "course_name": "Customer Service Excellence",
        "status": "enrolled"
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/retail/staff/STAFF-001/training")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Test Store Expenses
    resp = await client.post("/api/v1/retail/expenses", json={
        "store_id": "STORE-A",
        "expense_type": "rent",
        "amount": 5000.0,
        "period_month": 3,
        "period_year": 2026
    })
    assert resp.status_code == 200
    
    resp = await client.get("/api/v1/retail/expenses/STORE-A/3/2026")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["expense_type"] == "rent"
