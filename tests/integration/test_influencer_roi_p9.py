import pytest
from httpx import AsyncClient
from datetime import datetime

@pytest.mark.asyncio
async def test_influencer_roi_p9(client: AsyncClient):
    # 1. Create Influencer Campaign
    campaign_date = datetime.utcnow().isoformat()
    resp = await client.post("/api/v1/marketing-crm/campaigns", json={
        "brand_id": "BRAND-XYZ",
        "influencer_name": "FashionBlogger99",
        "platform": "Instagram",
        "cost": 1500.0,
        "reach": 50000,
        "engagement": 4500,
        "clicks": 1200,
        "conversions": 85,
        "revenue_generated": 6800.0,
        "roi": 3.53,
        "campaign_date": campaign_date,
        "status": "completed",
        "metadata_json": {"tags": ["summer_launch", "top_performer"]}
    })
    assert resp.status_code == 200
    assert resp.json()["influencer_name"] == "FashionBlogger99"
    
    # 2. Get Brand Campaigns
    resp = await client.get("/api/v1/marketing-crm/campaigns/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert any(c["influencer_name"] == "FashionBlogger99" for c in resp.json())
