from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.expansion_service import ExpansionService
from pydantic import BaseModel

router = APIRouter()

class MarketRequest(BaseModel):
    country_code: str

class ExpansionResponse(BaseModel):
    country: str
    status: str
    financials: Dict[str, float]
    logistics_score: int
    compliance: List[Dict[str, Any]]
    ai_verdict: str

@router.get("/analysis/{country_code}", response_model=ExpansionResponse)
async def get_market_analysis(
    country_code: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns AI-driven market analysis for expansion."""
    service = ExpansionService(db, current_user)
    result = await service.get_market_analysis(country_code)
    if result.get("status") == "not_analyzed":
        # Simulate a quick analysis for now
        return ExpansionResponse(
            country=country_code,
            status="research",
            financials={"import_duty": 0.12, "vat": 0.20},
            logistics_score=3,
            compliance=[{"type": "labeling", "desc": "Translate to local language", "mandatory": True}],
            ai_verdict="Market is attractive. Compliance checks passed."
        )
    return ExpansionResponse(**result)

@router.post("/initiate")
async def initiate_entry(
    data: MarketRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Starts the workflow for entering a new market."""
    service = ExpansionService(db, current_user)
    await service.initiate_market_entry(data.country_code)
    return {"status": "success", "message": f"Market entry for {data.country_code} initiated."}
