import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_customer_feedback_p13(client: AsyncClient):
    # 1. Submit Feedback
    resp = await client.post("/api/v1/analytics/feedback", json={
        "brand_id": "BRAND-XYZ",
        "sku_id": "JEANS-001",
        "customer_id": "CUST-444",
        "rating": 10,
        "comment": "Perfect fit, very comfortable!",
        "tags_json": {"quality": "high", "fit": "perfect"}
    })
    assert resp.status_code == 200
    assert resp.json()["rating"] == 10
    
    # 2. Get Brand Feedback
    resp = await client.get("/api/v1/analytics/feedback/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    
    # 3. Get NPS
    resp = await client.get("/api/v1/analytics/nps/BRAND-XYZ")
    assert resp.status_code == 200
    assert "nps_score" in resp.json()
    assert resp.json()["nps_score"] == 100.0 # Only one promoter
