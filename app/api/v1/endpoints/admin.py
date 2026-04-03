from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.core.config import settings
from app.core.endpoint_stats import get_stats, reset_stats
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.admin_service import AdminService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class DisputeCreate(BaseModel):
    target_org_id: str
    reason: str
    description: str
    order_id: Optional[str] = None

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target_role: Optional[str] = None

@router.get("/endpoint-stats", response_model=GenericResponse[Dict[str, Any]])
async def get_endpoint_stats(current_user: User = Depends(deps.get_current_active_user)):
    """Endpoint usage stats for audit (CLEANUP_PLAN Phase 5). Requires ENABLE_ENDPOINT_STATS=true."""
    if not settings.ENABLE_ENDPOINT_STATS:
        raise HTTPException(status_code=404, detail="Endpoint stats disabled")
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return GenericResponse(data={"endpoints": get_stats()})


@router.post("/endpoint-stats/reset")
async def reset_endpoint_stats(current_user: User = Depends(deps.get_current_active_user)):
    if not settings.ENABLE_ENDPOINT_STATS or current_user.role != "platform_admin":
        raise HTTPException(status_code=404, detail="Not found")
    reset_stats()
    return {"status": "reset"}


@router.get("/health", response_model=GenericResponse[Dict[str, Any]])
async def get_health(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    service = AdminService(db, current_user)
    health = await service.get_platform_health()
    return GenericResponse(data=health)

@router.post("/disputes", response_model=GenericResponse[Dict[str, Any]])
async def create_dispute(
    dispute_in: DisputeCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AdminService(db, current_user)
    dispute = await service.create_dispute(
        requester_org_id=current_user.organization_id,
        target_org_id=dispute_in.target_org_id,
        reason=dispute_in.reason,
        description=dispute_in.description,
        order_id=dispute_in.order_id
    )
    return GenericResponse(data={"id": dispute.id, "status": dispute.status})

@router.get("/disputes", response_model=GenericResponse[List[Dict[str, Any]]])
async def list_disputes(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    service = AdminService(db, current_user)
    disputes = await service.get_all_disputes()
    return GenericResponse(data=[{
        "id": d.id,
        "requester": d.requester_org_id,
        "target": d.target_org_id,
        "reason": d.reason,
        "status": d.status,
        "created_at": d.created_at
    } for d in disputes])

@router.post("/announcements", response_model=GenericResponse[Dict[str, Any]])
async def create_announcement(
    ann_in: AnnouncementCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    service = AdminService(db, current_user)
    ann = await service.create_announcement(ann_in.title, ann_in.content, ann_in.target_role)
    return GenericResponse(data={"id": ann.id, "status": "published"})
