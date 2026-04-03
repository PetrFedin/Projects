import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_retail_staffing_p6(client: AsyncClient):
    # 1. Create Swap Request
    resp = await client.post("/api/v1/staff/swaps", json={
        "requester_staff_id": "ST-001",
        "target_staff_id": "ST-002",
        "original_shift_id": 505
    })
    assert resp.status_code == 200
    assert resp.json()["status"] == "pending"
    
    # 2. Get Pending Swaps
    resp = await client.get("/api/v1/staff/swaps/ST-002")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Request Salary Advance
    resp = await client.post("/api/v1/staff/salary", json={
        "staff_id": "ST-001",
        "amount": 300.0
    })
    assert resp.status_code == 200
    assert resp.json()["amount"] == 300.0
    
    # 4. Get Salary Advances
    resp = await client.get("/api/v1/staff/salary/ST-001")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
