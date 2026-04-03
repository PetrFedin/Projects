import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_qc_checklist_api(client: AsyncClient):
    # 1. Create QC Check
    resp = await client.post("/api/v1/factory/qc", json={
        "order_id": "PO-999",
        "checklist_json": {"stitching": "pass", "measurements": "pass", "labels": "fail"},
        "inspector_id": "INS-007",
        "overall_status": "fail",
        "defect_report_url": "https://storage.synth-1.io/qc/PO-999-report.pdf"
    })
    assert resp.status_code == 200
    assert resp.json()["order_id"] == "PO-999"
    
    # 2. Get QC Results
    resp = await client.get("/api/v1/factory/qc/PO-999")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

@pytest.mark.asyncio
async def test_esg_metrics_api(client: AsyncClient):
    # 1. Create ESG Metric
    resp = await client.post("/api/v1/factory/esg", json={
        "factory_id": "FAC-X1",
        "waste_percentage": 5.2,
        "energy_consumption_kwh": 12500.0,
        "period_month": 3,
        "period_year": 2026
    })
    assert resp.status_code == 200
    assert resp.json()["waste_percentage"] == 5.2
    
    # 2. Get ESG Metrics
    resp = await client.get("/api/v1/factory/esg/FAC-X1")
    assert resp.status_code == 200
    assert len(resp.json()) >= 1
