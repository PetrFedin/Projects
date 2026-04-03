import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_dashboard_kpis_integration(client: AsyncClient):
    # 1. Login as Brand Admin
    login_data = {
        "username": "brand_admin@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create an order draft with some amount
    order_data = {
        "organization_id": "test_org_1",
        "buyer_id": "buyer_org_1",
        "items": [
            {"sku_id": "SKU-001", "quantity": 10, "unit_price": 50.0}, # Total: 500
            {"sku_id": "SKU-002", "quantity": 2, "unit_price": 250.0}  # Total: 500
        ]
    }
    response = await client.post("/api/v1/orders/draft", json=order_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["total_amount"] == 1000.0

    # 3. Create another order
    order_data_2 = {
        "organization_id": "test_org_1",
        "buyer_id": "buyer_org_1",
        "items": [
            {"sku_id": "SKU-003", "quantity": 1, "unit_price": 750.0}
        ]
    }
    await client.post("/api/v1/orders/draft", json=order_data_2, headers=headers)

    # 4. Check Brand Dashboard
    response = await client.get("/api/v1/dashboard/", headers=headers)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["kpis"]["total_orders"] == 2
    assert data["kpis"]["total_sales_amount"] == 1750.0

    # 5. Login as Buyer
    buyer_login = {
        "username": "buyer@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=buyer_login)
    buyer_token = response.json()["access_token"]
    buyer_headers = {"Authorization": f"Bearer {buyer_token}"}

    # 6. Check Buyer Dashboard
    response = await client.get("/api/v1/dashboard/", headers=buyer_headers)
    assert response.status_code == 200
    buyer_data = response.json()["data"]
    # The buyer should see orders where they are the buyer_id
    assert buyer_data["kpis"]["my_orders"] == 2
    assert buyer_data["kpis"]["my_total_spent"] == 1750.0
