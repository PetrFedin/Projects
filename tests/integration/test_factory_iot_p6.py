import pytest
from httpx import AsyncClient
from datetime import datetime

@pytest.mark.asyncio
async def test_factory_iot_esg_p6(client: AsyncClient):
    # 1. Submit Needle Count
    resp = await client.post("/api/v1/factory/needles", json={
        "machine_id": "MAC-001",
        "cycle_count": 55000,
        "last_replaced_at": datetime.utcnow().isoformat()
    })
    assert resp.status_code == 200
    assert resp.json()["cycle_count"] == 55000
    
    # 2. Get Machine Needles
    resp = await client.get("/api/v1/factory/needles/MAC-001")
    assert resp.status_code == 200
    
    # 3. Report Chemical Audit
    resp = await client.post("/api/v1/factory/chemicals", json={
        "factory_id": "FAC-X1",
        "chemical_name": "Reactive Dye Blue 19",
        "reach_compliant": True,
        "oeko_tex_certified": True,
        "last_audit_date": datetime.utcnow().isoformat()
    })
    assert resp.status_code == 200
    assert resp.json()["chemical_name"] == "Reactive Dye Blue 19"
    
    # 4. Get Factory Chemicals
    resp = await client.get("/api/v1/factory/chemicals/FAC-X1")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
