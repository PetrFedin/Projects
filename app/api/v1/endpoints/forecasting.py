from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.forecasting_service import DemandForecastingService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ForecastRequest(BaseModel):
    sku_id: str
    season: str
    visual_trend_score: float = 1.0

@router.post("/run", response_model=GenericResponse[Dict[str, Any]])
async def run_forecast(
    req: ForecastRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DemandForecastingService(db, current_user)
    forecast = await service.run_forecast(req.sku_id, req.season, req.visual_trend_score)
    return GenericResponse(data={
        "id": forecast.id,
        "sku_id": forecast.sku_id,
        "predicted_demand": forecast.predicted_demand,
        "confidence": forecast.confidence_score,
        "factors": forecast.factors_json
    })

@router.get("/latest", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_forecasts(
    sku_id: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DemandForecastingService(db, current_user)
    forecasts = await service.get_latest_forecasts(sku_id, season, limit)
    return GenericResponse(data=[{
        "id": f.id,
        "sku_id": f.sku_id,
        "season": f.season,
        "predicted_demand": f.predicted_demand,
        "confidence": f.confidence_score,
        "created_at": f.created_at
    } for f in forecasts])
