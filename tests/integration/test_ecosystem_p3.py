import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_factory_flow(client: AsyncClient):
    # 1. Submit telemetry
    payload = {
        "machine_id": "M_001",
        "status": "active",
        "oee": 88.5,
        "power_consumption": 12.4,
        "speed_rpm": 1200,
        "operator_id": "OP_X"
    }
    resp = await client.post("/api/v1/factory/telemetry", json=payload)
    assert resp.status_code == 200
    
    # 2. Get report
    resp = await client.get("/api/v1/factory/machines/M_001/report")
    assert resp.status_code == 200
    report = resp.json()
    assert report["current_status"] == "active"
    assert report["avg_oee_24h"] == 88.5

@pytest.mark.asyncio
async def test_marketing_flow(client):
    # 1. Generate content
    payload = {
        "sku_id": "SKU_TOP",
        "content_type": "social_post",
        "platform": "instagram",
        "style_context": "Playful and colorful"
    }
    resp = await client.post("/api/v1/marketing/generate", json=payload)
    assert resp.status_code == 200
    content_id = resp.json()["id"]
    
    # 2. Check content
    resp = await client.get("/api/v1/marketing/content/sku/SKU_TOP")
    assert resp.status_code == 200
    content = resp.json()
    assert len(content) == 1
    assert content[0]["platform"] == "instagram"

@pytest.mark.asyncio
async def test_staff_flow(client):
    # 1. Create reward
    payload = {
        "staff_id": "STAFF_01",
        "store_id": "STORE_A",
        "points": 100,
        "achievement_name": "Employee of the Month"
    }
    resp = await client.post("/api/v1/staff/rewards", json=payload)
    assert resp.status_code == 200
    
    # 2. Check leaderboard
    resp = await client.get("/api/v1/staff/leaderboard?store_id=STORE_A")
    assert resp.status_code == 200
    leaderboard = resp.json()
    assert len(leaderboard) == 1
    assert leaderboard[0]["staff_id"] == "STAFF_01"
    assert leaderboard[0]["total_points"] == 100
