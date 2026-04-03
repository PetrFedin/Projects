import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_costing_adv_p9(client: AsyncClient):
    # 1. Create Advanced Costing
    resp = await client.post("/api/v1/fintech/costing", json={
        "sku_id": "PREMIUM-SILK-001",
        "fabric_cost": 25.5,
        "trim_cost": 5.0,
        "labor_cost": 15.0,
        "logistics_cost": 3.5,
        "marketing_allocation": 10.0,
        "overhead_allocation": 8.0,
        "duty_cost": 4.5,
        "total_landed_cost": 71.5,
        "target_retail_price": 249.0,
        "projected_margin": 71.3
    })
    assert resp.status_code == 200
    assert resp.json()["sku_id"] == "PREMIUM-SILK-001"
    
    # 2. Get Advanced Costing
    resp = await client.get("/api/v1/fintech/costing/PREMIUM-SILK-001")
    assert resp.status_code == 200
    assert resp.json()["total_landed_cost"] == 71.5
    assert resp.json()["projected_margin"] == 71.3
