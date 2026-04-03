import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_ai_studio_p10(client: AsyncClient):
    # 1. Request AI Studio Task
    resp = await client.post("/api/v1/creative/ai-studio", json={
        "brand_id": "BRAND-XYZ",
        "original_url": "https://cdn.synth-1.io/raw/shirt-001.jpg",
        "task_type": "background_removal",
        "status": "pending"
    })
    assert resp.status_code == 200
    assert resp.json()["task_type"] == "background_removal"
    
    # 2. Get Brand Studio Assets
    resp = await client.get("/api/v1/creative/ai-studio/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1

    # 3. Submit SEO Copy
    resp = await client.post("/api/v1/marketing-crm/seo", json={
        "sku_id": "SHIRT-001",
        "language": "en",
        "tone_of_voice": "luxury",
        "content": "Handcrafted silk shirt with a minimalist cut.",
        "meta_title": "Premium Silk Shirt | BRAND-XYZ",
        "meta_description": "Discover our new silk collection."
    })
    assert resp.status_code == 200
    assert resp.json()["language"] == "en"
    
    # 4. Get SKU SEO Copies
    resp = await client.get("/api/v1/marketing-crm/seo/SHIRT-001")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
