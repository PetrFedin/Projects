import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_packing_label_api(client: AsyncClient):
    # 1. Create Packing List
    resp = await client.post("/api/v1/logistics/packing-lists", json={
        "order_id": "ORD-555",
        "box_number": "BOX-001",
        "items_json": {"TSHIRT-S": 10, "TSHIRT-M": 15},
        "total_weight_kg": 5.5,
        "volumetric_weight": 6.2
    })
    assert resp.status_code == 200
    assert resp.json()["box_number"] == "BOX-001"
    
    # 2. Get Packing List
    resp = await client.get("/api/v1/logistics/packing-lists/ORD-555")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Label Data
    resp = await client.post("/api/v1/logistics/labels", json={
        "sku_id": "TSHIRT-S",
        "barcode_ean13": "4006381333931",
        "care_instructions": "Machine wash cold, tumble dry low",
        "composition": "100% Organic Cotton",
        "size_label": "S"
    })
    assert resp.status_code == 200
    assert resp.json()["barcode_ean13"] == "4006381333931"
    
    # 4. Get Label Data
    resp = await client.get("/api/v1/logistics/labels/TSHIRT-S")
    assert resp.status_code == 200
    assert resp.json()["size_label"] == "S"
