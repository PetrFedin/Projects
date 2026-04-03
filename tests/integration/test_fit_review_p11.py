import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_fit_review_p11(client: AsyncClient):
    # 1. Submit Fit Correction
    resp = await client.post("/api/v1/product/fit-corrections", json={
        "sku_id": "JEANS-SS26-01",
        "photo_url": "https://cdn.synth-1.io/fit/photo-001.jpg",
        "pencil_marks_json": {"marks": [{"x": 100, "y": 200, "type": "line", "color": "red"}]},
        "voice_note_url": "https://cdn.synth-1.io/fit/voice-001.mp3",
        "comments": "Shorten the hem by 2cm."
    })
    assert resp.status_code == 200
    assert resp.json()["sku_id"] == "JEANS-SS26-01"
    
    # 2. Get Fit Corrections
    resp = await client.get("/api/v1/product/fit-corrections/JEANS-SS26-01")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert "marks" in resp.json()[0]["pencil_marks_json"]
