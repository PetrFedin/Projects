import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_brand_analytics_p6(client: AsyncClient):
    # 1. Submit Sell-Through
    resp = await client.post("/api/v1/analytics/sell-through", json={
        "brand_id": "BRAND-XYZ",
        "category": "Denim",
        "sold_qty": 450,
        "stock_initial": 1000,
        "sell_through_pct": 45.0
    })
    assert resp.status_code == 200
    assert resp.json()["category"] == "Denim"
    
    # 2. Get Brand Sell-Through
    resp = await client.get("/api/v1/analytics/sell-through/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

    # 3. Report Return
    resp = await client.post("/api/v1/analytics/returns", json={
        "sku_id": "JEANS-001",
        "reason_code": "sizing",
        "quantity": 5,
        "comments": "Too small at waist"
    })
    assert resp.status_code == 200
    assert resp.json()["reason_code"] == "sizing"
    
    # 4. Get SKU Returns
    resp = await client.get("/api/v1/analytics/returns/JEANS-001")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
