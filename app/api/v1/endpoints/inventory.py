from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.inventory_service import InventoryService
from pydantic import BaseModel

router = APIRouter()

@router.get("/vmi/{retailer_id}/status", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_retailer_stock_status(
    retailer_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = InventoryService(db, current_user)
    status = await service.get_retailer_stock_status(retailer_id)
    return GenericResponse(data=status)

@router.post("/vmi/{retailer_id}/forecast", response_model=GenericResponse[Dict[str, Any]])
async def forecast_replenishment(
    retailer_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = InventoryService(db, current_user)
    forecast = await service.forecast_replenishment(retailer_id)
    return GenericResponse(data=forecast)
