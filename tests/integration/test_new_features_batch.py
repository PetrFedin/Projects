import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_influencer_api(client: AsyncClient):
    # Create an influencer
    resp = await client.post("/api/v1/marketing-crm/influencers", json={
        "handle": "@fashion_influencer",
        "platform": "instagram",
        "follower_count": 50000,
        "avg_engagement": 4.5
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["handle"] == "@fashion_influencer"
    
    # Get the influencer
    resp = await client.get(f"/api/v1/marketing-crm/influencers/@fashion_influencer")
    assert resp.status_code == 200
    assert resp.json()["handle"] == "@fashion_influencer"

@pytest.mark.asyncio
async def test_milestone_api(client: AsyncClient):
    # Create a milestone
    resp = await client.post("/api/v1/factory/milestones", json={
        "order_id": "ORD-123",
        "milestone_name": "PPS Approval",
        "target_date": "2026-04-01T00:00:00"
    })
    assert resp.status_code == 200
    
    # Get milestones for order
    resp = await client.get("/api/v1/factory/orders/ORD-123/milestones")
    assert resp.status_code == 200
    milestones = resp.json()
    assert len(milestones) == 1
    assert milestones[0]["milestone_name"] == "PPS Approval"
