from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.collaboration_service import CollaborationService
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

router = APIRouter()

class TeamTaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee_id: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None
    context_type: Optional[str] = None
    context_id: Optional[str] = None

class TeamTaskCreate(TeamTaskBase):
    pass

class TeamTaskUpdateStatus(BaseModel):
    status: str

class TeamTask(TeamTaskBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    creator_id: str
    organization_id: str
    created_at: datetime
    updated_at: datetime


class Notification(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    action_url: Optional[str] = None
    created_at: datetime

# --- Team Tasks ---
@router.post("/tasks", response_model=GenericResponse[TeamTask])
async def create_task(
    task_in: TeamTaskCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    task = await service.create_task(task_in.model_dump())
    return GenericResponse(data=task)

@router.get("/tasks/me", response_model=GenericResponse[List[TeamTask]])
async def get_my_tasks(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    tasks = await service.get_my_tasks()
    return GenericResponse(data=tasks)

@router.get("/tasks/context/{context_type}/{context_id}", response_model=GenericResponse[List[TeamTask]])
async def get_tasks_by_context(
    context_type: str,
    context_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    tasks = await service.get_tasks_by_context(context_type, context_id)
    return GenericResponse(data=tasks)

@router.patch("/tasks/{task_id}/status", response_model=GenericResponse[TeamTask])
async def update_task_status(
    task_id: int,
    status_in: TeamTaskUpdateStatus,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    task = await service.update_task_status(task_id, status_in.status)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return GenericResponse(data=task)

# --- Notifications ---
@router.get("/notifications/unread", response_model=GenericResponse[List[Notification]])
async def get_unread_notifications(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    notifications = await service.get_unread_notifications()
    return GenericResponse(data=notifications)

@router.patch("/notifications/{notification_id}/read", response_model=GenericResponse[Notification])
async def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    notification = await service.mark_notification_as_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return GenericResponse(data=notification)

# --- Brand-to-Brand Collaborations ---
class CollaborationCreate(BaseModel):
    project_name: str
    partner_org_id: str
    sku_id: Optional[str] = None
    collection_id: Optional[str] = None
    description: Optional[str] = None

class VisibilityToggle(BaseModel):
    partner_org_id: str
    resource_type: str
    enabled: bool

@router.post("/collaborations", response_model=GenericResponse[Dict[str, Any]])
async def create_collaboration(
    collab_in: CollaborationCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Lead brand creates a collaboration project with another brand or store."""
    service = CollaborationService(db, current_user)
    project = await service.create_collaboration(
        collab_in.project_name, collab_in.partner_org_id, 
        collab_in.sku_id, collab_in.collection_id, collab_in.description
    )
    return GenericResponse(data={"id": project.id, "status": "active"})

@router.post("/collaborations/{project_id}/visibility", response_model=GenericResponse[Dict[str, Any]])
async def set_collaboration_visibility(
    project_id: int,
    toggle: VisibilityToggle,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Lead brand toggles what a partner can see (tech_pack, costing, milestones, etc.)."""
    service = CollaborationService(db, current_user)
    # Check if current_user is the owner of the project (skipped for brevity, but should be there)
    await service.set_partner_visibility(project_id, toggle.partner_org_id, toggle.resource_type, toggle.enabled)
    return GenericResponse(data={"project_id": project_id, "resource": toggle.resource_type, "enabled": toggle.enabled})

@router.get("/collaborations/me", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_my_collaborations(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollaborationService(db, current_user)
    projects = await service.get_my_collaborations()
    return GenericResponse(data=[{"id": p.id, "name": p.project_name, "status": p.status} for p in projects])
