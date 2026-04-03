from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.esg_service import ESGService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ESGMetricCreate(BaseModel):
    category: str
    value: float
    unit: str
    period: str = "monthly"

@router.get("/metrics", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_metrics(
    limit: int = 100,
    category: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """category: filter by metric category (carbon, water, waste, etc)."""
    service = ESGService(db, current_user)
    metrics = await service.get_latest_metrics()
    if category:
        metrics = [m for m in metrics if getattr(m, "category", None) == category]
    return GenericResponse(data=[{
        "id": m.id,
        "category": m.category,
        "value": m.value,
        "unit": m.unit,
        "period": m.period,
        "recorded_at": m.recorded_at
    } for m in metrics[:limit]])

@router.post("/metrics", response_model=GenericResponse[Dict[str, Any]])
async def record_metric(
    metric_in: ESGMetricCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ESGService(db, current_user)
    metric = await service.record_metric(
        metric_in.category,
        metric_in.value,
        metric_in.unit,
        metric_in.period
    )
    return GenericResponse(data={"id": metric.id, "status": "recorded"})

@router.get("/impact/simulate", response_model=GenericResponse[Dict[str, Any]])
async def simulate_impact(
    horizon_years: int = 1,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """horizon_years: simulation period (1-5)."""
    service = ESGService(db, current_user)
    impact = await service.simulate_annual_impact()
    if horizon_years and horizon_years > 1:
        impact = {**impact, "horizon_years": horizon_years}
    return GenericResponse(data=impact)
