from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Any, Dict
from app.api import deps
from app.db.repositories.audit import AuditRepository
from app.api.schemas.audit import AuditTrail, AuditTrailCreate
from app.db.models.base import AuditTrail as AuditModel, User
from app.services.audit_service import AuditService
from app.api.schemas.base import GenericResponse

router = APIRouter()

@router.get("/health", response_model=GenericResponse[Dict[str, Any]])
async def check_health(
    db: AsyncSession = Depends(deps.get_db)
):
    service = AuditService(db)
    health_data = await service.get_system_health()
    return GenericResponse(data=health_data)

@router.get("/{entity_type}/{entity_id}", response_model=GenericResponse[List[AuditTrail]])
async def get_audit_trail(
    entity_type: str,
    entity_id: str,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AuditService(db, current_user=current_user)
    history = await service.get_history(entity_type, entity_id)
    return GenericResponse(data=history[:limit])

@router.post("/", response_model=GenericResponse[AuditTrail])
async def create_audit_entry(
    audit_in: AuditTrailCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AuditService(db, current_user=current_user)
    new_audit = await service.log_action(
        entity_type=audit_in.entity_type,
        entity_id=audit_in.entity_id,
        action=audit_in.action,
        changes=audit_in.changes_json
    )
    return GenericResponse(data=new_audit)
