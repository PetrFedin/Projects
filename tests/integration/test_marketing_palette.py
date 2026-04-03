import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_color_story_api(client: AsyncClient):
    # 1. Create Color Story
    resp = await client.post("/api/v1/marketing/color-stories", json={
        "brand_id": "BRAND-XYZ",
        "collection_name": "Summer Zen 2026",
        "palette_json": [
            {"name": "Ocean Blue", "pantone": "19-4052 TCX", "hex": "#0F4C81"},
            {"name": "Sand Beige", "pantone": "13-1106 TCX", "hex": "#E1C699"}
        ]
    })
    assert resp.status_code == 200
    assert resp.json()["collection_name"] == "Summer Zen 2026"
    
    # 2. Get Color Story
    resp = await client.get("/api/v1/marketing/color-stories/Summer%20Zen%202026")
    assert resp.status_code == 200
    assert len(resp.json()["palette_json"]) == 2
