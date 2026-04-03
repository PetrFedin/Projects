from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Dict, Optional
from app.api import deps
from app.services.intelligence_service import IntelligenceService
from app.api.schemas.product import CompetitorSignal, CompetitorSignalCreate
from app.db.models.base import User
from app.api.schemas.base import GenericResponse

router = APIRouter()

@router.get("/", response_model=List[CompetitorSignal])
async def get_signals(
    limit: int = 100,
    skip: int = 0,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = IntelligenceService(db, current_user)
    return await service.get_competitor_signals(skip=skip, limit=limit)

@router.post("/signal", response_model=CompetitorSignal)
async def add_signal(
    signal_in: CompetitorSignalCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = IntelligenceService(db, current_user)
    return await service.add_signal(
        signal_in.competitor_name,
        signal_in.feature_name,
        signal_in.signal_type,
        signal_in.description,
        signal_in.url
    )

@router.post("/analyze", response_model=CompetitorSignal)
async def analyze_task(
    task: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = IntelligenceService(db, current_user)
    signal = await service.analyze_task(task)
    return signal

@router.get("/trend-radar", response_model=GenericResponse[Dict[str, Any]])
async def get_trend_radar(
    category: Optional[str] = None,
    limit: int = 20,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """category: filter by impact (high/critical/medium) or momentum."""
    service = IntelligenceService(db, current_user)
    trend_data = await service.get_trend_radar(category, limit)
    return GenericResponse(data=trend_data)
