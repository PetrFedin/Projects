import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_digital_twin_flow(client: AsyncClient):
    # 1. Submit feedback 1
    f1_payload = {
        "sku_id": "dress_01",
        "customer_id": "cust_A",
        "body_model_id": "SCAN_A",
        "fit_rating": 5,
        "comfort_score": 4,
        "comments": "Perfect fit around waist"
    }
    resp = await client.post("/api/v1/product-testing/feedback", json=f1_payload)
    assert resp.status_code == 200
    
    # 2. Submit feedback 2
    f2_payload = {
        "sku_id": "dress_01",
        "customer_id": "cust_B",
        "body_model_id": "SCAN_B",
        "fit_rating": 3,
        "comfort_score": 5,
        "comments": "A bit tight on shoulders"
    }
    resp = await client.post("/api/v1/product-testing/feedback", json=f2_payload)
    assert resp.status_code == 200
    
    # 3. Check summary
    resp = await client.get("/api/v1/product-testing/summary/dress_01")
    assert resp.status_code == 200
    summary = resp.json()
    assert summary["sku_id"] == "dress_01"
    assert summary["avg_fit_rating"] == 4.0
    assert summary["total_feedbacks"] == 2
