import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_compliance_flow(client: AsyncClient):
    # 1. Classify HS Code
    payload = {
        "sku_id": "SKU_SILK_DRESS",
        "hs_code": "6204.43",
        "description": "Women's silk dress",
        "confidence_score": 0.95,
        "country_context": "EU"
    }
    resp = await client.post("/api/v1/compliance/hs-code", json=payload)
    assert resp.status_code == 200
    
    # 2. Get HS Code
    resp = await client.get("/api/v1/compliance/hs-code/SKU_SILK_DRESS")
    assert resp.status_code == 200
    assert resp.json()["hs_code"] == "6204.43"
    
    # 3. Register Design
    copy_payload = {
        "design_id": "DSGN_001",
        "brand_id": "BRAND_A",
        "blockchain_tx_hash": "0x123abc",
        "status": "registered"
    }
    resp = await client.post("/api/v1/compliance/copyright", json=copy_payload)
    assert resp.status_code == 200
    
    # 4. List brand designs
    resp = await client.get("/api/v1/compliance/copyright/brand/BRAND_A")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_bottleneck_flow(client: AsyncClient):
    # 1. Report bottleneck
    payload = {
        "location_id": "PORT_SHANGHAI",
        "severity": "high",
        "impact_description": "Vessel congestion",
        "delay_days_est": 10
    }
    resp = await client.post("/api/v1/logistics/bottlenecks", json=payload)
    assert resp.status_code == 200
    b_id = resp.json()["id"]
    
    # 2. Get active
    resp = await client.get("/api/v1/logistics/bottlenecks")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    
    # 3. Resolve
    resp = await client.patch(f"/api/v1/logistics/bottlenecks/{b_id}/resolve")
    assert resp.status_code == 200
    
    # 4. Verify no active
    resp = await client.get("/api/v1/logistics/bottlenecks")
    assert resp.status_code == 200
    assert len(resp.json()) == 0
