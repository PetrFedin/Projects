import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_order_workflow_draft_to_submitted(client: AsyncClient):
    # 0. Login as brand
    login_data = {
        "username": "brand@synth1.com",
        "password": "brand_password"
    }
    resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Draft
    order_payload = {
        "organization_id": "brand_org_1",
        "buyer_id": "buyer_org_1",
        "items": [
            {"sku_id": "SKU_1", "quantity": 10, "unit_price": 100.0}
        ]
    }
    resp = await client.post("/api/v1/orders/draft", json=order_payload, headers=headers)
    assert resp.status_code == 200
    order_id = resp.json()["data"]["id"]
    assert resp.json()["data"]["status"] == "draft"
    assert resp.json()["data"]["total_amount"] == 1000.0

    # 2. Validate (should be valid as we have no MOQ/Credit set up yet)
    resp = await client.post(f"/api/v1/orders/{order_id}/validate", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["is_valid"] is True

    # 3. Submit
    resp = await client.post(f"/api/v1/orders/{order_id}/submit", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["data"]["status"] == "submitted"

    # 4. Try to submit again (should fail)
    resp = await client.post(f"/api/v1/orders/{order_id}/submit", headers=headers)
    assert resp.status_code == 400
    assert "draft" in resp.json()["detail"]

    @pytest.mark.asyncio
    async def test_order_cancel(client: AsyncClient):
        # 0. Login
        login_data = {
            "username": "brand@synth1.com",
            "password": "brand_password"
        }
        resp = await client.post("/api/v1/auth/login/access-token", data=login_data)
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
    
        # 1. Create Draft
        order_payload = {
            "organization_id": "brand_org_1",
            "buyer_id": "buyer_org_1",
            "items": [{"sku_id": "SKU_1", "quantity": 1, "unit_price": 50.0}]
        }
        resp = await client.post("/api/v1/orders/draft", json=order_payload, headers=headers)
        order_id = resp.json()["data"]["id"]
    
        # 2. Cancel
        resp = await client.post(f"/api/v1/orders/{order_id}/cancel", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "cancelled"
