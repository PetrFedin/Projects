import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_wholesale_linesheet_workflow(client: AsyncClient):
    # 0. Login
    login_data = {"username": "brand@synth1.com", "password": "brand_password"}
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Linesheet
    payload = {
        "title": "Summer 2026 Collection",
        "season": "SS26",
        "sku_list_json": ["SKU-001", "SKU-002"],
        "organization_id": "brand_org_1"
    }
    resp = await client.post("/api/v1/wholesale/linesheets", json=payload, headers=headers)
    assert resp.status_code == 200
    linesheet_id = resp.json()["data"]["id"]

    # 2. Generate PDF
    resp = await client.post(f"/api/v1/wholesale/linesheets/{linesheet_id}/generate", headers=headers)
    assert resp.status_code == 200
    assert "pdf_url" in resp.json()["data"]

@pytest.mark.asyncio
async def test_system_health_check(client: AsyncClient):
    resp = await client.get("/api/v1/audit/health")
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["status"] == "healthy"
    assert "project_metrics" in data
    assert data["project_metrics"]["total_sections"] > 0
    assert "notes" in data["project_metrics"]
