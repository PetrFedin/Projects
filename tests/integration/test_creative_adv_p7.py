import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_creative_adv_api(client: AsyncClient):
    # 1. Create AI Model Asset
    resp = await client.post("/api/v1/creative/ai-assets", json={
        "lookbook_id": 1,
        "image_url": "https://cdn.synth-1.io/ai/model-face-001.jpg",
        "asset_type": "face_generation",
        "prompt_used": "Elegant female model, 25 years old, professional studio lighting",
        "metadata_json": {"seed": 12345, "model_version": "v2.0"}
    })
    assert resp.status_code == 200
    assert resp.json()["asset_type"] == "face_generation"
    
    # 2. Get Lookbook AI Assets
    resp = await client.get("/api/v1/creative/ai-assets/1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Virtual Show Event
    sched_at = datetime.utcnow() + timedelta(days=7)
    resp = await client.post("/api/v1/creative/virtual-shows", json={
        "brand_id": "BRAND-XYZ",
        "title": "Spring/Summer 2026 Digital Runway",
        "scheduled_at": sched_at.isoformat(),
        "streaming_url": "https://stream.synth-1.io/shows/ss2026",
        "preorder_skus_json": ["TSHIRT-S", "TSHIRT-M", "JEANS-32"]
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "upcoming"
    
    # 4. Get Upcoming Shows
    resp = await client.get("/api/v1/creative/virtual-shows")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert any(s["title"] == "Spring/Summer 2026 Digital Runway" for s in resp.json())
