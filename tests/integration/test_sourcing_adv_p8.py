import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_sourcing_adv_api(client: AsyncClient):
    # 1. Create Sourcing Suggestion
    resp = await client.post("/api/v1/factory/sourcing", json={
        "brand_id": "BRAND-XYZ",
        "sku_category": "Luxury Knitwear",
        "factory_id": "KNIT-EXP-01",
        "match_score": 0.95,
        "reasoning_json": {
            "specialization": "High-end wool and cashmere",
            "capacity": "Available for Q3",
            "rating": "4.9/5 from 3 similar brands"
        },
        "status": "suggested"
    })
    assert resp.status_code == 200
    assert resp.json()["match_score"] == 0.95
    
    # 2. Get Brand Sourcing Suggestions
    resp = await client.get("/api/v1/factory/sourcing/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["factory_id"] == "KNIT-EXP-01"
