from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.global_compliance_service import GlobalComplianceService
from pydantic import BaseModel

router = APIRouter()

class TaxCalculationRequest(BaseModel):
    order_id: str
    country_code: str
    amount: float

class SanctionCheckRequest(BaseModel):
    entity_id: str
    entity_name: str

class TaxReportRequest(BaseModel):
    country_code: str
    period: str

@router.post("/calculate-tax", response_model=Dict[str, Any])
async def calculate_tax(
    data: TaxCalculationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Calculates cross-border tax for an order."""
    service = GlobalComplianceService(db, current_user)
    return await service.calculate_transaction_tax(data.order_id, data.country_code, data.amount)

@router.post("/sanction-check", response_model=Dict[str, Any])
async def run_sanction_check(
    data: SanctionCheckRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Runs a sanction/AML check on an entity."""
    service = GlobalComplianceService(db, current_user)
    check = await service.run_sanction_check(data.entity_id, data.entity_name)
    return {
        "id": check.id,
        "entity_id": check.target_entity_id,
        "name": check.target_name,
        "result": check.result,
        "risk_score": check.risk_score
    }

@router.post("/tax-reports", response_model=Dict[str, Any])
async def generate_tax_report(
    data: TaxReportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generates a summary tax report for a period."""
    service = GlobalComplianceService(db, current_user)
    report = await service.generate_tax_report(data.country_code, data.period)
    return {
        "id": report.id,
        "country": report.country_code,
        "period": report.period,
        "total_tax": report.total_tax_amount,
        "currency": report.currency,
        "status": report.status
    }
