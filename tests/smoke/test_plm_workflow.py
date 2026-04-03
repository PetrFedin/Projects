import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta

@pytest.mark.asyncio
async def test_plm_sourcing_workflow(client: AsyncClient, brand_token_headers):
    # 1. Get Suppliers
    response = await client.get("/api/v1/plm/suppliers", headers=brand_token_headers)
    assert response.status_code == 200
    
    # 2. Create Material Order
    mat_order_payload = {
        "supplier_id": 1,
        "material_name": "Premium Cotton",
        "quantity": 500.5,
        "unit": "m",
        "total_price": 2500.0,
        "currency": "USD"
    }
    response = await client.post("/api/v1/plm/material-orders", json=mat_order_payload, headers=brand_token_headers)
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "ordered"

@pytest.mark.asyncio
async def test_plm_tech_pack_workflow(client: AsyncClient, brand_token_headers):
    sku_id = "SKU-PLM-001"
    
    # 1. Save Tech Pack Details
    payload = {
        "grading": {
            "base_size": "M",
            "increments_json": {"L": "+2cm", "XL": "+4cm"}
        },
        "construction": {
            "finishing_description": "Reinforced seams, brushed finish"
        }
    }
    response = await client.post(f"/api/v1/plm/tech-pack/{sku_id}/details", json=payload, headers=brand_token_headers)
    assert response.status_code == 200
    
    # 2. Calculate BOM
    response = await client.get(f"/api/v1/plm/bom/{sku_id}/calculate?quantity=100", headers=brand_token_headers)
    assert response.status_code == 200
    assert "requirements" in response.json()["data"]

@pytest.mark.asyncio
async def test_plm_sampling_and_collaboration(client: AsyncClient, brand_token_headers):
    # 1. Order Sample
    sample_payload = {
        "sku_id": "SKU-PLM-001",
        "factory_id": "FACT-001",
        "sample_type": "Proto 1"
    }
    response = await client.post("/api/v1/plm/samples", json=sample_payload, headers=brand_token_headers)
    assert response.status_code == 200
    
    # 2. Send Production Message
    msg_payload = {
        "context_id": "SKU-PLM-001",
        "text": "Please check the sleeve length on the first prototype.",
        "recipient_role": "production"
    }
    response = await client.post("/api/v1/plm/messages", json=msg_payload, headers=brand_token_headers)
    assert response.status_code == 200
