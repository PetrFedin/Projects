import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_global_trade_api(client: AsyncClient):
    # 1. Create Customs Declaration
    resp = await client.post("/api/v1/logistics/customs", json={
        "order_id": "ORD-INTL-001",
        "declaration_number": "DECL-2026-999",
        "hs_codes_json": {"61091000": 500, "62034231": 1200},
        "total_duties_usd": 150.5,
        "status": "draft"
    })
    assert resp.status_code == 200
    assert resp.json()["declaration_number"] == "DECL-2026-999"
    
    # 2. Get Customs Declaration
    resp = await client.get("/api/v1/logistics/customs/ORD-INTL-001")
    assert resp.status_code == 200
    assert resp.json()["total_duties_usd"] == 150.5

    # 3. Create EAC Certificate
    expiry = datetime.utcnow() + timedelta(days=365)
    resp = await client.post("/api/v1/logistics/certificates", json={
        "certificate_number": "RU-C-CN.AB01.B.12345",
        "sku_ids_json": ["TSHIRT-S", "TSHIRT-M"],
        "expiry_date": expiry.isoformat(),
        "certification_body": "SGS Vostok Limited"
    })
    assert resp.status_code == 200
    assert resp.json()["certificate_number"] == "RU-C-CN.AB01.B.12345"
    
    # 4. Get Certificate
    resp = await client.get("/api/v1/logistics/certificates/RU-C-CN.AB01.B.12345")
    assert resp.status_code == 200
    assert resp.json()["certification_body"] == "SGS Vostok Limited"

    # 5. Create Compliance Log
    resp = await client.post("/api/v1/logistics/compliance", json={
        "partner_id": "SUPPLIER-ASIA-1",
        "action": "sanction_check",
        "result": "cleared",
        "details_json": {"checked_at": datetime.utcnow().isoformat(), "source": "OFAC List"}
    })
    assert resp.status_code == 200
    assert resp.json()["result"] == "cleared"
    
    # 6. Get Compliance Logs
    resp = await client.get("/api/v1/logistics/compliance/SUPPLIER-ASIA-1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1
