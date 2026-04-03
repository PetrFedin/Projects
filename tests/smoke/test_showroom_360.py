import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_showroom_360_vertical_flow(client: AsyncClient):
    # 1. Login as Brand Admin
    login_data = {
        "username": "brand_admin@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload 360 Video Asset
    video_data = {
        "title": "Sneaker 360 Experience",
        "asset_type": "360_video",
        "original_url": "https://storage.synth1.com/raw/sneaker_360.mp4"
    }
    response = await client.post("/api/v1/dam/", json=video_data, headers=headers)
    assert response.status_code == 200
    video_id = response.json()["data"]["id"]

    # 3. Process the video (AI background removal mock)
    proc_req = {"remove_background": True}
    response = await client.post(f"/api/v1/dam/{video_id}/process", json=proc_req, headers=headers)
    assert response.status_code == 200
    processed_url = response.json()["data"]["processed_url"]
    assert "_no_bg" in processed_url

    # 4. Create Showroom
    sr_data = {
        "name": "Paris Fashion Week 2026",
        "season_id": "FW26",
        "is_public": True
    }
    response = await client.post("/api/v1/showrooms/", json=sr_data, headers=headers)
    assert response.status_code == 200
    showroom_id = response.json()["data"]["id"]

    # 5. Attach 360 Asset to Showroom
    response = await client.post(f"/api/v1/showrooms/{showroom_id}/attach-asset/{video_id}", headers=headers)
    assert response.status_code == 200
    showroom = response.json()["data"]
    assert showroom["vr_url"] == processed_url
    assert showroom["media_asset_id"] == video_id

    # 6. Check Dashboard (Brand)
    response = await client.get("/api/v1/dashboard/", headers=headers)
    assert response.status_code == 200
    dashboard_data = response.json()["data"]
    assert dashboard_data["kpis"]["active_showrooms"] >= 1

    # 7. Login as Buyer
    buyer_login = {
        "username": "buyer@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=buyer_login)
    buyer_token = response.json()["access_token"]
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

    # 8. Buyer sees the public showroom
    response = await client.get("/api/v1/showrooms/", headers=buyer_headers)
    assert response.status_code == 200
    showrooms = response.json()["data"]
    assert any(s["name"] == "Paris Fashion Week 2026" for s in showrooms)
    
    # 9. Buyer sees accessible showrooms on dashboard
    response = await client.get("/api/v1/dashboard/", headers=buyer_headers)
    assert response.status_code == 200
    buyer_dashboard = response.json()["data"]
    assert buyer_dashboard["kpis"]["accessible_showrooms"] >= 1
