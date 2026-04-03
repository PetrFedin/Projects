import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_range_drops_p10(client: AsyncClient):
    # 1. Create Collection Drop
    drop_date = datetime.utcnow() + timedelta(days=30)
    resp = await client.post("/api/v1/product/drops", json={
        "brand_id": "BRAND-XYZ",
        "season": "AW2026",
        "drop_name": "Drop 1: Core Essentials",
        "scheduled_date": drop_date.isoformat(),
        "sku_list_json": {"skus": ["SHIRT-001", "PANTS-002", "JACKET-003"]},
        "status": "planned"
    })
    assert resp.status_code == 200
    assert resp.json()["drop_name"] == "Drop 1: Core Essentials"
    
    # 2. Get Brand Collection Drops
    resp = await client.get("/api/v1/product/drops/BRAND-XYZ?season=AW2026")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert "JACKET-003" in resp.json()[0]["sku_list_json"]["skus"]
