import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_academy_api(client: AsyncClient):
    login = await client.post("/api/v1/auth/login/access-token", data={
        "username": "brand@synth1.com",
        "password": "brand_password",
    })
    assert login.status_code == 200
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    # 1. Create Academy Module
    resp = await client.post("/api/v1/academy/modules", json={
        "brand_id": "BRAND-XYZ",
        "title": "Summer 2026 Visual Merchandising",
        "content_url": "https://storage.synth-1.io/academy/vm-guide-ss26.pdf",
        "category": "Visual Merchandising"
    }, headers=headers)
    assert resp.status_code == 200
    module_id = resp.json()["data"]["id"]

    # 2. Create Academy Test
    resp = await client.post("/api/v1/academy/tests", json={
        "module_id": module_id,
        "questions_json": {
            "1": {"q": "Where should the mannequin be placed?", "a": "Entrance"},
            "2": {"q": "What is the primary color theme?", "a": "Ocean Blue"}
        },
        "passing_score": 100
    }, headers=headers)
    assert resp.status_code == 200
    test_id = resp.json()["data"]["id"]

    # 3. Submit Test Result
    resp = await client.post("/api/v1/academy/results", json={
        "staff_id": "ST-001",
        "test_id": test_id,
        "score": 100,
        "is_passed": True
    }, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["is_passed"] is True

    # 4. Get Staff Results
    resp = await client.get("/api/v1/academy/results/ST-001", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()["data"]) == 1
