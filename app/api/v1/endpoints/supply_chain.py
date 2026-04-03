from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.supply_chain_service import SupplyChainService
from pydantic import BaseModel

router = APIRouter()

class RiskAnalysisRequest(BaseModel):
    batch_id: str

class RiskMitigationRequest(BaseModel):
    risk_id: int
    action: str

class RiskResponse(BaseModel):
    id: int
    batch_id: str | None
    risk_type: str
    severity: str
    impact_description: str
    estimated_delay_days: int
    status: str

@router.post("/analyze-batch", response_model=Dict[str, Any])
async def analyze_batch_risk(
    data: RiskAnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Triggers an AI analysis of production batch risk."""
    service = SupplyChainService(db, current_user)
    result = await service.analyze_batch_risk(data.batch_id)
    return result

@router.get("/active-risks", response_model=List[RiskResponse])
async def get_active_risks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns all currently active supply chain risks for the organization."""
    service = SupplyChainService(db, current_user)
    risks = await service.get_active_risks()
    return [RiskResponse(
        id=r.id,
        batch_id=r.batch_id,
        risk_type=r.risk_type,
        severity=r.severity,
        impact_description=r.impact_description,
        estimated_delay_days=r.estimated_delay_days,
        status=r.status
    ) for r in risks]

@router.post("/mitigate")
async def mitigate_risk(
    data: RiskMitigationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Records a mitigation action and updates the risk status."""
    service = SupplyChainService(db, current_user)
    await service.mitigate_risk(data.risk_id, data.action)
    return {"status": "success", "message": f"Risk {data.risk_id} marked as mitigated."}
