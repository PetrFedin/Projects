import pytest
from httpx import AsyncClient
from app.db.models.base import TeamTask, MaterialOrder
from sqlalchemy import select

@pytest.mark.asyncio
async def test_horizontal_integration_production_to_collab(client: AsyncClient, db, brand_token_headers):
    """
    Vertical & Horizontal Integration Test:
    1. Create Material Order (Production Module)
    2. Check if AI Rule Engine automatically created a Task (Collaboration Module)
    """
    # 1. Create Material Order via API
    order_data = {
        "supplier_id": 1,
        "material_name": "Premium Silk",
        "total_price": 5000.0,
        "quantity": 100.0,
        "unit": "meters",
        "currency": "USD"
    }
    
    resp = await client.post("/api/v1/plm/material-orders", json=order_data, headers=brand_token_headers)
    assert resp.status_code == 200
    order_id = resp.json()["data"]["id"]
    
    # 2. Check if a task was created by the AI Rule Engine
    query = select(TeamTask).where(
        TeamTask.context_type == "production",
        TeamTask.context_id == str(order_id)
    )
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    
    assert task is not None
    assert "AUTO: Проверить спецификации" in task.title
    assert task.status == "todo"
    assert task.priority == "high"

@pytest.mark.asyncio
async def test_horizontal_integration_collection_to_collab(client: AsyncClient, db, brand_token_headers):
    """
    Test if creating a Drop triggers a task.
    """
    drop_data = {
        "drop_name": "Summer High 2026",
        "season": "SS26",
        "scheduled_date": "2026-06-01T00:00:00",
        "sku_list_json": {},
        "status": "planned"
    }
    
    resp = await client.post("/api/v1/collections/drops", json=drop_data, headers=brand_token_headers)
    assert resp.status_code == 200
    drop_id = resp.json()["data"]["id"]
    
    query = select(TeamTask).where(
        TeamTask.context_type == "collection",
        TeamTask.context_id == str(drop_id)
    )
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    
    assert task is not None
    assert "AUTO: Настроить план пополнения" in task.title

@pytest.mark.asyncio
async def test_horizontal_integration_compliance_to_collab(client: AsyncClient, db, brand_token_headers):
    """
    Test if signing an EDO document triggers a task.
    """
    # 1. Manually create a document in DB first (since there's no POST for create doc yet in endpoints)
    from app.db.models.base import EDODocument
    doc = EDODocument(
        doc_type="UPD",
        doc_number="UPD-TEST-001",
        partner_org_id="partner-1",
        total_amount=1000.0,
        organization_id="brand_org_1",  # match brand_token_headers org
        status="sent"
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    
    # 2. Sign via API
    resp = await client.post(f"/api/v1/compliance/edo/{doc.id}/sign", headers=brand_token_headers)
    assert resp.status_code == 200
    
    # 3. Check Task
    query = select(TeamTask)
    result = await db.execute(query)
    tasks = result.scalars().all()
    print(f"DEBUG: Found {len(tasks)} tasks: {[t.title for t in tasks]}")
    
    task = next((t for t in tasks if t.context_type == "compliance" and t.context_id == str(doc.id)), None)
    
    assert task is not None
    assert "AUTO: Архивировать подписанный УПД" in task.title

@pytest.mark.asyncio
async def test_horizontal_integration_fintech_to_collab(client: AsyncClient, db, brand_token_headers):
    """
    Test if creating an invoice triggers a task.
    """
    invoice_data = {
        "invoice_number": "INV-2025-001",
        "order_id": "ORD-123",
        "amount": 15000.0,
        "currency": "RUB",
        "status": "pending"
    }
    
    resp = await client.post("/api/v1/fintech/invoices", json=invoice_data, headers=brand_token_headers)
    assert resp.status_code == 200
    invoice_id = resp.json()["data"]["id"]
    
    # Check Task
    query = select(TeamTask).where(
        TeamTask.context_type == "fintech",
        TeamTask.context_id == str(invoice_id)
    )
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    
    assert task is not None
    assert "AUTO: Подтвердить оплату счета" in task.title
