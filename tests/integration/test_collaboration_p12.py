import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_collaboration_p12(client: AsyncClient):
    # 1. Create Collaboration Project
    resp = await client.post("/api/v1/collaboration/projects", json={
        "owner_brand_id": "BRAND-A",
        "partner_brand_id": "BRAND-B",
        "project_name": "Summer Capsule 2026",
        "description": "Joint collection for beachwear",
        "status": "active"
    })
    assert resp.status_code == 200
    project_id = resp.json()["id"]
    
    # 2. Grant Access
    resp = await client.post("/api/v1/collaboration/access", json={
        "project_id": project_id,
        "user_id": "USER-X",
        "access_level": "editor",
        "resource_type": "tech_pack"
    })
    assert resp.status_code == 200
    
    # 3. Verify Access
    resp = await client.get(f"/api/v1/collaboration/verify-access/USER-X/{project_id}")
    assert resp.status_code == 200
    assert resp.json()["access_level"] == "editor"
