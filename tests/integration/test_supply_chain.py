import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_supply_chain_features(client: AsyncClient):
    # 1. Test Suppliers
    resp = await client.post("/api/v1/supply-chain/suppliers", json={
        "name": "Global Fabric Co",
        "supplier_type": "fabric",
        "rating": 4.8
    })
    assert resp.status_code == 200
    supplier_id = resp.json()["id"]
    
    resp = await client.get("/api/v1/supply-chain/suppliers")
    assert resp.status_code == 200
    assert any(s["name"] == "Global Fabric Co" for s in resp.json())

    # 2. Test Material Orders
    resp = await client.post("/api/v1/supply-chain/material-orders", json={
        "supplier_id": supplier_id,
        "material_name": "Premium Cotton",
        "quantity": 500.0,
        "unit": "m",
        "total_price": 2500.0
    })
    assert resp.status_code == 200
    order_id = resp.json()["id"]
    
    resp = await client.get(f"/api/v1/supply-chain/material-orders/{supplier_id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Test Lab Dips
    resp = await client.post("/api/v1/supply-chain/lab-dips", json={
        "material_order_id": order_id,
        "color_name": "Navy Blue",
        "pantone_code": "19-4029 TCX"
    })
    assert resp.status_code == 200
    
    resp = await client.get(f"/api/v1/supply-chain/lab-dips/{order_id}")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["color_name"] == "Navy Blue"
