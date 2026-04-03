import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_invoice_api(client: AsyncClient):
    # 1. Create Invoice
    resp = await client.post("/api/v1/fintech/invoices", json={
        "invoice_number": "INV-2026-001",
        "order_id": "ORD-12345",
        "amount": 12500.5,
        "currency": "EUR",
        "conversion_rate_to_usd": 1.08
    })
    assert resp.status_code == 200
    assert resp.json()["invoice_number"] == "INV-2026-001"
    
    # 2. Get Invoice by number
    resp = await client.get("/api/v1/fintech/invoices/INV-2026-001")
    assert resp.status_code == 200
    assert resp.json()["amount"] == 12500.5
    
    # 3. Get All Invoices
    resp = await client.get("/api/v1/fintech/invoices")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
