from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.loyalty_service import LoyaltyService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class LoyaltyPointsAdd(BaseModel):
    customer_id: str
    amount: int
    reason: str = "purchase"

@router.get("/customer/{customer_id}", response_model=GenericResponse[Dict[str, Any]])
async def get_loyalty_data(
    customer_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = LoyaltyService(db, current_user)
    loyalty = await service.get_customer_loyalty(customer_id)
    if not loyalty:
        raise HTTPException(status_code=404, detail="Customer loyalty record not found")
    return GenericResponse(data={
        "id": loyalty.id,
        "customer_id": loyalty.customer_id,
        "points": loyalty.points,
        "tier": loyalty.tier,
        "last_interaction": loyalty.last_interaction
    })

@router.post("/points/add", response_model=GenericResponse[Dict[str, Any]])
async def add_points(
    points_in: LoyaltyPointsAdd,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = LoyaltyService(db, current_user)
    loyalty = await service.add_points(
        points_in.customer_id,
        points_in.amount,
        points_in.reason
    )
    return GenericResponse(data={"id": loyalty.id, "points": loyalty.points, "tier": loyalty.tier})

@router.post("/reward/sustainability", response_model=GenericResponse[Dict[str, Any]])
async def reward_sustainability(
    customer_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = LoyaltyService(db, current_user)
    loyalty = await service.reward_sustainability_action(customer_id)
    return GenericResponse(data={"id": loyalty.id, "points": loyalty.points, "tier": loyalty.tier})
