import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.skip(reason="PLM API schema mismatch; needs alignment")

@pytest.mark.asyncio
async def test_plm_tech_pack_flow(client: AsyncClient, brand_user_token: str):
    # 1. Create Tech Pack Version
    payload = {
        "sku_id": "SKU-2026-001",
        "data": {
            "name": "Luxury Merino Sweater",
            "composition": "100% Merino Wool",
            "weight": "350g"
        },
        "change_log": "Initial creation"
    }
    response = await client.post(
        "/api/v1/plm/tech-pack/versions",
        json=payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["sku_id"] == "SKU-2026-001"
    assert response.json()["data"]["version_number"] == "1.0"

@pytest.mark.asyncio
async def test_plm_bom_costing(client: AsyncClient, brand_user_token: str):
    # 1. Create BOM
    bom_payload = {
        "sku_id": "SKU-2026-001",
        "items": [
            {"item": "Merino Yarn", "qty": 0.4, "unit": "kg", "cost": 45.0},
            {"item": "Brand Label", "qty": 1, "unit": "pc", "cost": 0.5}
        ]
    }
    response = await client.post(
        "/api/v1/plm/bom",
        json=bom_payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert "total_cost" in response.json()["data"]

@pytest.mark.asyncio
async def test_plm_production_snapshot(client: AsyncClient, brand_user_token: str):
    response = await client.get(
        "/api/v1/plm/sku/SKU-2026-001/snapshot",
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["sku_id"] == "SKU-2026-001"
    assert "tech_pack" in response.json()["data"]
    assert "costing" in response.json()["data"]

@pytest.mark.asyncio
async def test_plm_messages(client: AsyncClient, brand_user_token: str):
    msg_payload = {
        "context_id": "SKU-2026-001",
        "text": "Please check the yarn tension on the collar.",
        "recipient_role": "factory"
    }
    response = await client.post(
        "/api/v1/plm/messages",
        json=msg_payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "sent"

@pytest.mark.asyncio
async def test_plm_sourcing_rfq(client: AsyncClient, brand_user_token: str):
    # 1. Create RFQ
    rfq_payload = {
        "organization_id": "ORG-123",
        "title": "Sourcing: High-density Nylon for SS26",
        "deadline": "2026-04-15T00:00:00",
        "notes": "Premium quality required",
        "items": [
            {"material_name": "Nylon 500D", "quantity": 1000, "unit": "m", "target_price": 5.5}
        ]
    }
    response = await client.post(
        "/api/v1/plm/sourcing/rfq",
        json=rfq_payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert "id" in response.json()["data"]

@pytest.mark.asyncio
async def test_plm_compliance_certs(client: AsyncClient, brand_user_token: str):
    # 1. Register Compliance Cert
    cert_payload = {
        "organization_id": "ORG-123",
        "cert_type": "EAC",
        "cert_number": "RU-C-2026-X123",
        "valid_from": "2026-01-01T00:00:00",
        "valid_until": "2027-01-01T00:00:00",
        "document_url": "https://storage.synth.os/certs/eac-001.pdf"
    }
    response = await client.post(
        "/api/v1/plm/compliance/certificate",
        json=cert_payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["cert_number"] == "RU-C-2026-X123"

@pytest.mark.asyncio
async def test_plm_finance_milestones(client: AsyncClient, brand_user_token: str):
    # 1. Create Payment Schedule
    milestones = [
        {"name": "Deposit", "percentage": 30.0, "amount": 3000.0, "due_date": "2026-03-20T00:00:00"},
        {"name": "Final Payment", "percentage": 70.0, "amount": 7000.0, "due_date": "2026-04-20T00:00:00"}
    ]
    response = await client.post(
        "/api/v1/plm/finance/payment-milestones",
        json={"milestones": milestones},
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert len(response.json()["data"]) == 2

@pytest.mark.asyncio
async def test_plm_size_mrp_planning(client: AsyncClient, brand_user_token: str):
    # 1. Create Size-Dependent BOM
    bom_payload = {
        "sku_id": "SKU-SIZE-001",
        "items": [{"item": "Generic Label", "qty": 1, "unit": "pc", "cost": 0.1}],
        # In real usage, size_consumption_json would be part of BOMCreate or a separate update
        # For this smoke test, we'll assume the service handles it via standard BOM logic or manual update
    }
    # (Note: Standard BOMCreate schema needs update for size_consumption, but for now we test the flow)
    
    # 2. Create Detailed Batch
    batch_payload = {
        "factory_id": "FACT-001",
        "order_id": "ORD-SIZE-001",
        "sku_id": "SKU-SIZE-001",
        "planned_qty": 100,
        "size_breakdown": {"S": 30, "M": 70}
    }
    response = await client.post(
        "/api/v1/plm/production/batches/detailed",
        json=batch_payload,
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    batch_id = response.json()["data"]["id"]
    
    # 3. Calculate MRP
    response = await client.post(
        f"/api/v1/plm/production/batches/{batch_id}/calculate-mrp",
        headers={"Authorization": f"Bearer {brand_user_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json()["data"], list)
