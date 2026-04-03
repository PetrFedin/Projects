from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.distributor_service import DistributorService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class QuotaCreate(BaseModel):
    sku_id: str
    dealer_id: str
    quantity: int

class PerformanceRecord(BaseModel):
    region: str
    total_sales: float
    order_count: int
    period: str = "monthly"

@router.get("/performance", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_performance(
    region: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DistributorService(db, current_user)
    data = await service.get_regional_performance(region)
    return GenericResponse(data=[{
        "id": r.id,
        "region": r.region,
        "sales": r.total_sales,
        "orders": r.order_count,
        "period": r.period
    } for r in data])

@router.post("/performance", response_model=GenericResponse[Dict[str, Any]])
async def record_performance(
    perf_in: PerformanceRecord,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DistributorService(db, current_user)
    perf = await service.record_performance(perf_in.model_dump())
    return GenericResponse(data={"id": perf.id, "status": "recorded"})

@router.post("/quotas", response_model=GenericResponse[Dict[str, Any]])
async def allocate_quota(
    quota_in: QuotaCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DistributorService(db, current_user)
    quota = await service.allocate_quota(quota_in.sku_id, quota_in.dealer_id, quota_in.quantity)
    return GenericResponse(data={"id": quota.id, "status": quota.status})

@router.get("/dealers/{dealer_id}/kpi", response_model=GenericResponse[Dict[str, Any]])
async def get_dealer_kpi(
    dealer_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = DistributorService(db, current_user)
    kpi = await service.get_dealer_kpi(dealer_id)
    if not kpi:
        raise HTTPException(status_code=404, detail="Dealer KPI not found")
    return GenericResponse(data={
        "dealer_id": kpi.dealer_id,
        "trust_score": kpi.trust_score,
        "accuracy": kpi.historical_accuracy
    })
