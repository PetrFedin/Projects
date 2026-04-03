import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_sustainability_adv_api(client: AsyncClient):
    # 1. Create Product LCA
    resp = await client.post("/api/v1/product/lca", json={
        "sku_id": "ECO-TEE-001",
        "carbon_footprint_kg": 2.4,
        "water_usage_liters": 15.0,
        "recycle_info_json": {"instructions": "Return to store for recycling", "material_composition": "100% Organic Cotton"},
        "sustainability_score": 88.5
    })
    assert resp.status_code == 200
    assert resp.json()["sku_id"] == "ECO-TEE-001"
    
    # 2. Get Product LCA
    resp = await client.get("/api/v1/product/lca/ECO-TEE-001")
    assert resp.status_code == 200
    assert resp.json()["sustainability_score"] == 88.5

    # 3. Create Material Trace
    resp = await client.post("/api/v1/supply-chain/trace", json={
        "material_id": "ORG-COTTON-01",
        "origin_country": "Turkey",
        "factory_id": "SPIN-TX-01",
        "blockchain_hash": "0xabc123def456",
        "certification_urls_json": {"GOTS": "https://cert.org/gots/123", "OEKO-TEX": "https://cert.org/oeko/456"}
    })
    assert resp.status_code == 200
    assert resp.json()["origin_country"] == "Turkey"
    
    # 4. Get Material Trace
    resp = await client.get("/api/v1/supply-chain/trace/ORG-COTTON-01")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
