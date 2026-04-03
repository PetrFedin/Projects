import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_and_generate_linesheet(client: AsyncClient):
    # 1. Login
    login_data = {
        "username": "sales@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Linesheet
    ls_data = {
        "title": "Summer Collection 2026",
        "season": "SS26",
        "sku_list_json": ["SKU-001", "SKU-002", "SKU-003"],
        "status": "draft"
    }
    response = await client.post("/api/v1/wholesale/linesheets", json=ls_data, headers=headers)
    assert response.status_code == 200
    linesheet = response.json()["data"]
    assert linesheet["title"] == "Summer Collection 2026"
    ls_id = linesheet["id"]

    # 3. Generate PDF
    response = await client.post(f"/api/v1/wholesale/linesheets/{ls_id}/generate", headers=headers)
    assert response.status_code == 200
    assert "pdf_url" in response.json()["data"]
    assert response.json()["data"]["pdf_url"].endswith(".pdf")
