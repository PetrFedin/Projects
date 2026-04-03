from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_db
from app.db.repositories.risk import RiskRepository
from app.api.schemas.risk import GlobalRisk, GlobalRiskCreate, RiskAnalysisRequest
from app.agents.risk_agent import risk_agent
from app.db.models.base import GlobalLogisticsRisk as RiskModel

router = APIRouter()

@router.get("/active", response_model=List[GlobalRisk])
async def get_active_risks(
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    repo = RiskRepository(db)
    items = await repo.get_active_risks()
    return items[:limit]

@router.get("/region/{region}", response_model=List[GlobalRisk])
async def get_region_risks(
    region: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    repo = RiskRepository(db)
    items = await repo.get_by_region(region)
    return items[:limit]

@router.post("/analyze", response_model=GlobalRisk)
async def analyze_risk(req: RiskAnalysisRequest, db: AsyncSession = Depends(get_db)):
    # 1. Run Risk Agent
    context = {
        "region": req.region,
        "context": req.context
    }
    result = await risk_agent.run(req.region, context=context)
    
    # 2. Simulate saving analyzed risk
    repo = RiskRepository(db)
    
    # Simple rule-based logic to parse some risk from agent's analysis result
    new_risk = RiskModel(
        region=req.region,
        risk_level="high", # Simplified
        description=result.code_changes,
        impact_score=7.5, # Simplified
        mitigation_plan="AI Proposed: Activate alternate routes.",
        is_active=True
    )
    return await repo.create(new_risk)

@router.patch("/{risk_id}/resolve")
async def resolve_risk(risk_id: int, db: AsyncSession = Depends(get_db)):
    repo = RiskRepository(db)
    risk = await repo.get(risk_id)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    
    await repo.update(risk.id, is_active=False)
    return {"message": "Risk resolved successfully"}
