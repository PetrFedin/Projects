import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_quota_allocation_flow(client: AsyncClient):
    # 1. Create KPI for dealer
    kpi_payload = {
        "dealer_id": "dealer_001",
        "historical_accuracy": 0.85,
        "trust_score": 90.0,
        "regional_demand_index": 1.2
    }
    resp = await client.post("/api/v1/quota/kpi", json=kpi_payload)
    assert resp.status_code == 200
    
    # 2. Run allocation
    alloc_payload = {
        "sku_id": "sku_winter_jacket",
        "total_quantity": 100,
        "dealer_ids": ["dealer_001"]
    }
    resp = await client.post("/api/v1/quota/allocate", json=alloc_payload)
    assert resp.status_code == 200
    allocations = resp.json()
    assert len(allocations) == 1
    assert allocations[0]["sku_id"] == "sku_winter_jacket"
    assert allocations[0]["dealer_id"] == "dealer_001"
    # trust_score 90, so qty should be 100 * (90/50) = 180 (clamped by total but here we only have 1 dealer)
    # in our code it is int(avg_qty * (kpi.trust_score / 50)) = 100 * 1.8 = 180
    assert allocations[0]["allocated_quantity"] == 180

    # 3. Check SKU allocations
    resp = await client.get("/api/v1/quota/sku_winter_jacket")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
