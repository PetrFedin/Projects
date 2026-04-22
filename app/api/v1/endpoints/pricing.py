from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.pricing_service import PricingService
from pydantic import BaseModel

router = APIRouter()

class DynamicPriceRequest(BaseModel):
    sku_id: str
    current_price: float

class DynamicPriceResponse(BaseModel):
    sku_id: str
    suggested_price: float
    reasoning: str
    margin_estimate: float

@router.post("/calculate", response_model=DynamicPriceResponse)
async def calculate_dynamic_price(
    data: DynamicPriceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Calculates optimal dynamic price for an SKU using AI."""
    service = PricingService(db, current_user)
    result = await service.calculate_dynamic_price(data.sku_id, data.current_price)
    return DynamicPriceResponse(**result)

@router.get("/audit/{collection_id}", response_model=Dict[str, Any])
async def get_margin_audit(
    collection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns a margin audit report for a specific collection."""
    service = PricingService(db, current_user)
    # The existing get_margin_audit in PricingService is very simple, we can keep it for now.
    result = await service.get_margin_audit(collection_id)
    return result
