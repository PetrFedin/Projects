import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_predictive_production_api(client: AsyncClient):
    # 1. Create Predictive Capacity
    future_date = datetime.utcnow() + timedelta(days=30)
    resp = await client.post("/api/v1/factory/predictive-capacity", json={
        "factory_id": "FAC-AI-001",
        "historical_avg_delay_days": 2.5,
        "defect_rate_percent": 1.2,
        "current_backlog_hours": 480,
        "predicted_availability_date": future_date.isoformat(),
        "ai_confidence_score": 0.92
    })
    assert resp.status_code == 200
    assert resp.json()["factory_id"] == "FAC-AI-001"

    # 2. Get Predictive Capacity
    resp = await client.get("/api/v1/factory/predictive-capacity/FAC-AI-001")
    assert resp.status_code == 200
    assert resp.json()["ai_confidence_score"] == 0.92
