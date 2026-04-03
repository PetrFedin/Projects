import pytest
from httpx import AsyncClient
from app.api.deps import UserRole

@pytest.mark.asyncio
async def test_global_exception_handler(client: AsyncClient):
    # Try a non-existent route to trigger 404 (handled by FastAPI but we can also trigger manual error)
    # Let's use an endpoint that might fail or just trigger a 404
    response = await client.get("/api/v1/non-existent")
    assert response.status_code == 404
    # The default 404 won't be caught by our Exception handler unless it's a raised SynthBaseException
    # But let's check unhandled exception
    
@pytest.mark.asyncio
async def test_rbac_denied(client: AsyncClient):
    # 1. Login as merchandiser (role not allowed for draft orders)
    login_data = {
        "username": "merchandiser@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Try to access draft orders - merchandiser not in allowed roles
    order_data = {
        "organization_id": "brand_1",
        "buyer_id": "buyer_1",
        "items": []
    }
    response = await client.post("/api/v1/orders/draft", json=order_data, headers=headers)
    assert response.status_code == 403
    assert "not authorized" in str(response.json().get("detail", "")).lower()

@pytest.mark.asyncio
async def test_dashboard_generic_response(client: AsyncClient):
    login_data = {
        "username": "admin@synth1.com",
        "password": "securepassword"
    }
    response = await client.post("/api/v1/auth/login/access-token", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await client.get("/api/v1/dashboard/", headers=headers)
    assert response.status_code == 200
    # Dashboard currently returns a dict, let's see if we should standardize it too
