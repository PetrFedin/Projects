from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.client_service import ClientService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class BodyScanCreate(BaseModel):
    height_cm: float
    chest_cm: float
    waist_cm: float
    hips_cm: float
    scan_url: Optional[str] = None

@router.get("/wardrobe", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_wardrobe(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ClientService(db, current_user)
    items = await service.get_wardrobe()
    return GenericResponse(data=[{
        "id": i.id,
        "sku_id": i.sku_id,
        "purchase_date": i.purchase_date,
        "condition": i.condition
    } for i in items])

@router.post("/wardrobe", response_model=GenericResponse[Dict[str, Any]])
async def add_to_wardrobe(
    sku_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ClientService(db, current_user)
    item = await service.add_to_wardrobe(sku_id)
    return GenericResponse(data={"id": item.id, "status": "added"})

@router.post("/body-scan", response_model=GenericResponse[Dict[str, Any]])
async def save_body_scan(
    scan_in: BodyScanCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ClientService(db, current_user)
    scan = await service.save_body_scan(scan_in.model_dump())
    return GenericResponse(data={"id": scan.id, "status": "saved"})

@router.get("/wallet", response_model=GenericResponse[Dict[str, Any]])
async def get_wallet(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = ClientService(db, current_user)
    wallet = await service.get_wallet()
    return GenericResponse(data={
        "balance": wallet.balance,
        "currency": wallet.currency,
        "bonus_points": wallet.bonus_points
    })
