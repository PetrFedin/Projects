from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.size_curve_service import SizeCurveService
from pydantic import BaseModel

router = APIRouter()

class SizeCurveRequest(BaseModel):
    sku_id: str
    region: str
    category: Optional[str] = None

@router.post("/calculate", response_model=GenericResponse[Dict[str, Any]])
async def calculate_curve(
    req: SizeCurveRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = SizeCurveService(db, current_user)
    curve = await service.calculate_size_curve(req.sku_id, req.region, req.category)
    return GenericResponse(data={
        "id": curve.id,
        "sku_id": curve.sku_id,
        "region": curve.region,
        "curve": curve.curve_json,
        "confidence": curve.confidence_score
    })

@router.get("/latest", response_model=GenericResponse[Optional[Dict[str, Any]]])
async def get_latest_curve(
    sku_id: str,
    region: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = SizeCurveService(db, current_user)
    curve = await service.get_latest_curve(sku_id, region)
    if not curve:
        return GenericResponse(data=None)
    return GenericResponse(data={
        "id": curve.id,
        "curve": curve.curve_json,
        "created_at": curve.created_at
    })
