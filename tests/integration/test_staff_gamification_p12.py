import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_staff_gamification_p12(client: AsyncClient):
    # 1. Update Staff Stats (Initial Create)
    resp = await client.post("/api/v1/academy/leaderboard", json={
        "staff_id": "STAFF-007",
        "brand_id": "BRAND-XYZ",
        "points": 1500,
        "sales_count": 50,
        "customer_rating": 4.8,
        "rank_title": "Senior Stylist"
    })
    assert resp.status_code == 200
    assert resp.json()["points"] == 1500
    
    # 2. Get Brand Leaderboard
    resp = await client.get("/api/v1/academy/leaderboard/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert any(s["staff_id"] == "STAFF-007" for s in resp.json())
    
    # 3. Update Points
    resp = await client.post("/api/v1/academy/leaderboard", json={
        "staff_id": "STAFF-007",
        "brand_id": "BRAND-XYZ",
        "points": 2000,
        "sales_count": 65,
        "customer_rating": 4.9,
        "rank_title": "Top Seller"
    })
    assert resp.status_code == 200
    assert resp.json()["points"] == 2000
    assert resp.json()["rank_title"] == "Top Seller"
