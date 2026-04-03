import pytest
from httpx import AsyncClient
from app.db.models.base import CompetitorSignal

@pytest.mark.asyncio
async def test_intelligence_analyze_workflow(client: AsyncClient):
    # 0. Login
    login_data = {
        "username": "brand@synth1.com",
        "password": "brand_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Analyze
    task = "Analyze competitor pricing strategy for Summer 2026"
    resp = await client.post(f"/api/v1/intelligence/analyze?task={task}", headers=headers)
    assert resp.status_code == 200
    signal = resp.json()
    assert signal["signal_type"] == "trend"
    assert signal.get("organization_id")

    # 2. Get All Signals
    resp = await client.get("/api/v1/intelligence/", headers=headers)
    assert resp.status_code == 200
    signals = resp.json()
    assert len(signals) >= 1
    assert any(s["id"] == signal["id"] for s in signals)
