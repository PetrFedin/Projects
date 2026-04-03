import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_analytics_flow(client: AsyncClient):
    # 1. Submit footfall
    payload = {
        "store_id": "STORE_MAIN",
        "zone_id": "fitting_rooms",
        "visitor_count": 50,
        "dwell_time_avg": 120.0
    }
    resp = await client.post("/api/v1/analytics/footfall", json=payload)
    assert resp.status_code == 200
    
    # 2. Get footfall for store
    resp = await client.get("/api/v1/analytics/footfall/store/STORE_MAIN")
    assert resp.status_code == 200
    metrics = resp.json()
    assert len(metrics) == 1
    assert metrics[0]["zone_id"] == "fitting_rooms"
    
    # 3. Add AR node
    ar_payload = {
        "store_id": "STORE_MAIN",
        "node_id": "NODE_A",
        "location_name": "Denim Wall",
        "coordinates_json": {"x": 10.5, "y": 2.0, "z": 0.0}
    }
    resp = await client.post("/api/v1/analytics/ar/nodes", json=ar_payload)
    assert resp.status_code == 200
    
    # 4. Get AR nodes
    resp = await client.get("/api/v1/analytics/ar/nodes/STORE_MAIN")
    assert resp.status_code == 200
    nodes = resp.json()
    assert len(nodes) == 1
    assert nodes[0]["node_id"] == "NODE_A"

@pytest.mark.asyncio
async def test_risk_flow(client):
    # 1. Analyze risk
    payload = {
        "region": "Red Sea",
        "context": "Supply chain disruption due to vessel rerouting."
    }
    resp = await client.post("/api/v1/risk/analyze", json=payload)
    assert resp.status_code == 200
    risk_id = resp.json()["id"]
    
    # 2. Get active risks
    resp = await client.get("/api/v1/risk/active")
    assert resp.status_code == 200
    risks = resp.json()
    assert len(risks) == 1
    assert risks[0]["region"] == "Red Sea"
    
    # 3. Resolve risk
    resp = await client.patch(f"/api/v1/risk/{risk_id}/resolve")
    assert resp.status_code == 200
    
    # 4. Check active risks again
    resp = await client.get("/api/v1/risk/active")
    assert resp.status_code == 200
    assert len(resp.json()) == 0
