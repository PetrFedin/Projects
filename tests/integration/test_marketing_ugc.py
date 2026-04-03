import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_marketing_ugc_api(client: AsyncClient):
    # 1. Create UGC Post
    resp = await client.post("/api/v1/marketing/ugc", json={
        "customer_id": "CUST-123",
        "sku_id": "TSHIRT-WHITE-M",
        "image_url": "https://cdn.synth-1.io/ugc/cust-123-photo.jpg",
        "caption": "Loving my new tee! #synth1"
    })
    assert resp.status_code == 200
    post_id = resp.json()["id"]
    assert resp.json()["status"] == "pending"
    
    # 2. Approve UGC Post
    resp = await client.patch(f"/api/v1/marketing/ugc/{post_id}/approve")
    assert resp.status_code == 200
    
    # 3. Get Approved SKU UGC
    resp = await client.get("/api/v1/marketing/ugc/TSHIRT-WHITE-M")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
    assert resp.json()[0]["status"] == "approved"
