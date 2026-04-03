import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_wholesale_crm_api(client: AsyncClient):
    # 1. Send Wholesale Message
    resp = await client.post("/api/v1/wholesale/messages", json={
        "sender_id": "BRAND-XYZ",
        "receiver_id": "BUYER-ABC",
        "order_id": "ORD-777",
        "message_text": "Production is on schedule. Expect shipping next week."
    })
    assert resp.status_code == 200
    assert resp.json()["message_text"] == "Production is on schedule. Expect shipping next week."
    
    # 2. Get Order Messages
    resp = await client.get("/api/v1/wholesale/messages/ORD-777")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 3. Create Order Log
    resp = await client.post("/api/v1/wholesale/order-logs", json={
        "order_id": "ORD-777",
        "action": "status_change",
        "details_json": {"from": "pending", "to": "in_production"},
        "user_id": "MANAGER-01"
    })
    assert resp.status_code == 200
    assert resp.json()["action"] == "status_change"
    
    # 4. Get Order Logs
    resp = await client.get("/api/v1/wholesale/order-logs/ORD-777")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    # 5. Create Credit Memo
    resp = await client.post("/api/v1/wholesale/credit-memos", json={
        "partner_id": "BUYER-ABC",
        "amount": 150.0,
        "reason": "Return of damaged items from previous order"
    })
    assert resp.status_code == 200
    assert resp.json()["amount"] == 150.0
    
    # 6. Get Partner Memos
    resp = await client.get("/api/v1/wholesale/credit-memos/BUYER-ABC")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
