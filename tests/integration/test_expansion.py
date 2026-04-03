import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_market_expansion_api(client: AsyncClient):
    # 1. Create Market
    resp = await client.post("/api/v1/expansion/markets", json={
        "country_code": "US",
        "market_status": "setup",
        "avg_import_duty": 12.5,
        "local_vat_rate": 0.0,
        "logistics_complexity_score": 4
    })
    assert resp.status_code == 200
    assert resp.json()["country_code"] == "US"

    # 2. Get Market
    resp = await client.get("/api/v1/expansion/markets/US")
    assert resp.status_code == 200
    assert resp.json()["market_status"] == "setup"

    # 3. Create Compliance Requirement
    resp = await client.post("/api/v1/expansion/compliance", json={
        "country_code": "US",
        "requirement_type": "labeling",
        "description": "Care labels must be in English",
        "is_mandatory": True
    })
    assert resp.status_code == 200
    assert resp.json()["requirement_type"] == "labeling"

    # 4. Get Compliance Requirements
    resp = await client.get("/api/v1/expansion/compliance/US")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
