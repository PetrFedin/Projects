import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_order_validation_rules(client: AsyncClient):
    # 1. Login
    login_data = {
        "username": "brand@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Setup MOQ rule
    moq_data = {
        "sku_id": "SKU-RULE-001",
        "min_units": 10
    }
    await client.post("/api/v1/wholesale/moq", json=moq_data, headers=headers)

    # 3. Create Draft with violation
    order_data = {
        "organization_id": "test_org_1",
        "buyer_id": "buyer_org_1",
        "items": [
            {"sku_id": "SKU-RULE-001", "quantity": 5, "unit_price": 100.0}
        ]
    }
    response = await client.post("/api/v1/orders/draft", json=order_data, headers=headers)
    assert response.status_code == 200
    order_id = response.json()["data"]["id"]

    # 4. Validate and check errors
    response = await client.post(f"/api/v1/orders/{order_id}/validate", headers=headers)
    assert response.status_code == 200
    result = response.json()["data"]
    assert result["is_valid"] is False
    assert any("minimum order quantity" in err for err in result["errors"])

    # 5. Fix order and validate again
    # (Simplified: we'll just create a new draft that is valid)
    order_data_ok = {
        "organization_id": "test_org_1",
        "buyer_id": "buyer_org_1",
        "items": [
            {"sku_id": "SKU-RULE-001", "quantity": 15, "unit_price": 100.0}
        ]
    }
    response = await client.post("/api/v1/orders/draft", json=order_data_ok, headers=headers)
    order_id_ok = response.json()["data"]["id"]
    
    response = await client.post(f"/api/v1/orders/{order_id_ok}/validate", headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["is_valid"] is True
