import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_wishlist_referral_api(client: AsyncClient):
    # 1. Create Wishlist Group
    resp = await client.post("/api/v1/wardrobe/wishlist", json={
        "user_id": "USER-100",
        "name": "Summer Collection",
        "sku_ids_json": {"SKU-001": 1, "SKU-002": 1}
    })
    assert resp.status_code == 200
    assert resp.json()["name"] == "Summer Collection"
    
    # 2. Get User Wishlists
    resp = await client.get("/api/v1/wardrobe/wishlist/USER-100")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Referral
    resp = await client.post("/api/v1/wardrobe/referral", json={
        "referrer_id": "USER-100",
        "referred_id": "NEW-USER-200",
        "status": "pending",
        "reward_amount": 50.0
    })
    assert resp.status_code == 200
    assert resp.json()["referred_id"] == "NEW-USER-200"
    
    # 4. Get Referrals
    resp = await client.get("/api/v1/wardrobe/referral/USER-100")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
