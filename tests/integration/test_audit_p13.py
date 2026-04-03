import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_audit_trail_p13(client: AsyncClient):
    # 1. Create Audit Entry
    resp = await client.post("/api/v1/audit/", json={
        "entity_type": "tech_pack",
        "entity_id": "TP-101",
        "action": "update",
        "changes_json": {"version": "2.5", "status": "approved"},
        "user_id": "USER-ADMIN"
    })
    assert resp.status_code == 200
    assert resp.json()["entity_id"] == "TP-101"
    
    # 2. Get Audit Trail
    resp = await client.get("/api/v1/audit/tech_pack/TP-101")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert resp.json()[0]["action"] == "update"
