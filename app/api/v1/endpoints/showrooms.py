from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user, check_permissions, UserRole
from app.services.showroom_service import ShowroomService
from app.api.schemas.showroom import Showroom, ShowroomCreate, ShowroomItem, ShowroomItemCreate
from app.api.schemas.base import GenericResponse
from app.db.models.base import User

router = APIRouter()

@router.get("/", response_model=GenericResponse[List[Showroom]])
async def get_showrooms(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns showrooms for the current organization."""
    service = ShowroomService(db, current_user)
    showrooms = await service.get_all()
    return GenericResponse(data=showrooms[:limit])

@router.post("/", response_model=GenericResponse[Showroom])
async def create_showroom(
    data: ShowroomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, 
        UserRole.SALES_REP, UserRole.DISTRIBUTOR
    ]))
):
    """Creates a new digital showroom."""
    service = ShowroomService(db, current_user)
    new_showroom = await service.create_showroom(data)
    return GenericResponse(data=new_showroom)

@router.post("/{showroom_id}/attach-asset/{media_asset_id}", response_model=GenericResponse[Showroom])
async def attach_asset_to_showroom(
    showroom_id: int,
    media_asset_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER,
        UserRole.SALES_REP, UserRole.DISTRIBUTOR
    ]))
):
    """Attaches a DAM media asset (e.g. 360 video) to a showroom."""
    service = ShowroomService(db, current_user)
    showroom = await service.attach_asset(showroom_id, media_asset_id)
    if not showroom:
        raise HTTPException(status_code=404, detail="Showroom or media asset not found")
    return GenericResponse(data=showroom)

@router.post("/{showroom_id}/items", response_model=GenericResponse[ShowroomItem])
async def add_showroom_item(
    showroom_id: int,
    item_data: ShowroomItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, 
        UserRole.SALES_REP, UserRole.DISTRIBUTOR
    ]))
):
    """Adds a product item to a digital showroom."""
    service = ShowroomService(db, current_user)
    try:
        item = await service.add_item(showroom_id, item_data)
        return GenericResponse(data=item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{showroom_id}/360", response_model=GenericResponse[Dict[str, Any]])
async def get_showroom_360(
    showroom_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns the immersive 360 experience metadata for a showroom."""
    service = ShowroomService(db, current_user)
    experience = await service.get_showroom_360_experience(showroom_id)
    return GenericResponse(data=experience)

@router.post("/{showroom_id}/visit")
async def register_visit(
    showroom_id: str,
    organization_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Registers a visitor and triggers follow-up actions."""
    service = ShowroomService(db, current_user)
    await service.add_visitor(showroom_id, organization_id)
    return {"status": "success", "message": "Visit registered"}
