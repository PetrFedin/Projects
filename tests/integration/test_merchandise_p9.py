import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_merchandise_p9(client: AsyncClient):
    # 1. Create Merchandise Grid
    resp = await client.post("/api/v1/analytics/merchandise", json={
        "brand_id": "BRAND-XYZ",
        "season": "SS2026",
        "total_budget": 500000.0,
        "category_split_json": {"top": 0.4, "bottom": 0.3, "outerwear": 0.2, "acc": 0.1},
        "target_units": 10000
    })
    assert resp.status_code == 200
    assert resp.json()["season"] == "SS2026"
    
    # 2. Get Brand Merchandise Grids
    resp = await client.get("/api/v1/analytics/merchandise/BRAND-XYZ?season=SS2026")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["target_units"] == 10000
