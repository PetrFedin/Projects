import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_construction_details_api(client: AsyncClient):
    # 1. Create Construction Detail
    resp = await client.post("/api/v1/product/construction", json={
        "sku_id": "TSHIRT-001",
        "seam_schemes_json": {"side_seam": "overlock-3-thread", "hem": "flatlock-2-needle"},
        "finishing_description": "Clean finish with cotton tape at neck"
    })
    assert resp.status_code == 200
    assert resp.json()["sku_id"] == "TSHIRT-001"
    
    # 2. Get Construction Detail
    resp = await client.get("/api/v1/product/construction/TSHIRT-001")
    assert resp.status_code == 200
    assert resp.json()["finishing_description"] == "Clean finish with cotton tape at neck"

@pytest.mark.asyncio
async def test_swatches_api(client: AsyncClient):
    # 1. Create Digital Swatch
    resp = await client.post("/api/v1/product/swatches", json={
        "material_name": "Supima Cotton 160g",
        "pantone_code": "19-4052 TCX",
        "hex_color": "#0F4C81",
        "texture_url": "https://storage.synth-1.io/textures/supima-navy.jpg"
    })
    assert resp.status_code == 200
    assert resp.json()["material_name"] == "Supima Cotton 160g"
    
    # 2. Get Digital Swatch
    resp = await client.get("/api/v1/product/swatches/Supima%20Cotton%20160g")
    assert resp.status_code == 200
    assert resp.json()["pantone_code"] == "19-4052 TCX"
