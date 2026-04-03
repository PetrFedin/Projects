import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_dam_ai_processing(client: AsyncClient):
    # 1. Login
    login_data = {
        "username": "brand_admin@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload Asset (Metadata only for now)
    asset_data = {
        "title": "New Jacket Packshot",
        "asset_type": "image",
        "original_url": "https://storage.synth1.com/raw/jacket_01.jpg",
        "metadata_json": {"camera": "Sony A7IV"}
    }
    response = await client.post("/api/v1/dam/", json=asset_data, headers=headers)
    assert response.status_code == 200
    asset_id = response.json()["data"]["id"]

    # 3. Request AI Background Removal
    proc_data = {
        "remove_background": True,
        "apply_watermark": True
    }
    response = await client.post(f"/api/v1/dam/{asset_id}/process", json=proc_data, headers=headers)
    assert response.status_code == 200
    result = response.json()["data"]
    assert result["has_background_removed"] is True
    assert result["has_watermark"] is True
    assert "_no_bg_watermarked" in result["processed_url"]

    # 4. 360 Video config
    video_data = {
        "title": "Sneaker 360",
        "asset_type": "360_video",
        "original_url": "https://storage.synth1.com/raw/sneaker_360.mp4"
    }
    response = await client.post("/api/v1/dam/", json=video_data, headers=headers)
    video_id = response.json()["data"]["id"]
    
    response = await client.post(f"/api/v1/dam/{video_id}/360-config", headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["is_360"] is True
