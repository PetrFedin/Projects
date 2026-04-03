from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.collection_service import CollectionService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class CollectionDropBase(BaseModel):
    season: str
    drop_name: str
    scheduled_date: datetime
    sku_list_json: Dict
    status: str = "planned"

class ColorStoryBase(BaseModel):
    collection_name: str
    palette_json: Dict

class MerchandiseGridBase(BaseModel):
    total_budget: float
    category_split_json: Dict
    target_units: int

# --- Drops ---
@router.get("/drops", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_drops(
    season: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    drops = await service.get_drops(season, status, limit)
    return GenericResponse(data=[{
        "id": d.id, 
        "drop_name": d.drop_name, 
        "season": d.season, 
        "status": d.status,
        "scheduled_date": d.scheduled_date
    } for d in drops])

@router.post("/drops", response_model=GenericResponse[Dict[str, Any]])
async def create_drop(
    drop_in: CollectionDropBase,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    drop = await service.create_drop(drop_in.model_dump())
    return GenericResponse(data={"id": drop.id, "status": drop.status})

# --- Color Stories ---
@router.post("/color-stories", response_model=GenericResponse[Dict[str, Any]])
async def create_color_story(
    story_in: ColorStoryBase,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    story = await service.create_color_story(story_in.model_dump())
    return GenericResponse(data={"id": story.id, "collection_name": story.collection_name})

@router.get("/color-stories", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_color_stories(
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    stories = await service.get_color_stories(limit)
    return GenericResponse(data=[{
        "id": s.id, 
        "collection_name": s.collection_name, 
        "palette": s.palette_json
    } for s in stories])

# --- Merchandise Grid ---
@router.get("/merchandise-grid/{season}", response_model=GenericResponse[Dict[str, Any]])
async def get_merchandise_grid(
    season: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    grid = await service.get_merchandise_grid(season)
    if not grid:
        raise HTTPException(status_code=404, detail="Grid not found for this season")
    return GenericResponse(data={
        "id": grid.id,
        "season": grid.season,
        "total_budget": grid.total_budget,
        "category_split": grid.category_split_json,
        "target_units": grid.target_units
    })

@router.post("/merchandise-grid/{season}", response_model=GenericResponse[Dict[str, Any]])
async def save_merchandise_grid(
    season: str,
    grid_in: MerchandiseGridBase,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = CollectionService(db, current_user)
    grid = await service.save_merchandise_grid(season, grid_in.model_dump())
    return GenericResponse(data={"id": grid.id, "status": "saved"})
