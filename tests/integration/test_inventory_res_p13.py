import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_inventory_reservation_p13(client: AsyncClient):
    # 1. Create Reservation
    resp = await client.post("/api/v1/supply-chain/reservations", json={
        "brand_id": "BRAND-XYZ",
        "material_id": "FABRIC-COTTON-01",
        "sku_id": "SHIRT-SS26",
        "reserved_quantity": 120.5,
        "status": "reserved"
    })
    assert resp.status_code == 200
    assert resp.json()["reserved_quantity"] == 120.5
    
    # 2. Get Brand Reservations
    resp = await client.get("/api/v1/supply-chain/reservations/BRAND-XYZ")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
    assert resp.json()[0]["material_id"] == "FABRIC-COTTON-01"
