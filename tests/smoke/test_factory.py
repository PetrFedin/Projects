import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_factory_telemetry_workflow(client: AsyncClient):
    # 0. Login
    login_data = {
        "username": "brand@synth1.com",
        "password": "brand_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Submit Telemetry
    tele_payload = {
        "machine_id": "MCH_001",
        "status": "active",
        "oee": 0.85,
        "power_consumption": 120.5
    }
    resp = await client.post("/api/v1/factory/telemetry", json=tele_payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["machine_id"] == "MCH_001"

    # 2. Get Report
    resp = await client.get("/api/v1/factory/machines/MCH_001/report", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["machine_id"] == "MCH_001"
    assert data["current_status"] == "active"
    assert data["avg_oee_24h"] == 0.85

@pytest.mark.asyncio
async def test_factory_schedule_milestones(client: AsyncClient):
    # 0. Login
    login_data = {"username": "brand@synth1.com", "password": "brand_password"}
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Milestone
    milestone_payload = {
        "order_id": "ORD_123",
        "milestone_name": "Fabric Cutting",
        "target_date": "2026-05-01T10:00:00",
        "status": "pending"
    }
    resp = await client.post("/api/v1/factory/milestones", json=milestone_payload, headers=headers)
    assert resp.status_code == 200
    
    # 2. Get Milestones
    resp = await client.get("/api/v1/factory/orders/ORD_123/milestones", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    assert data[0]["milestone_name"] == "Fabric Cutting"
