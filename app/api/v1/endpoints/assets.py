from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.asset_service import BrandAssetService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AssetCreate(BaseModel):
    asset_type: str
    title: str
    file_url: str
    is_public: bool = True

@router.get("/", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_assets(
    public_only: bool = True,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = BrandAssetService(db, current_user)
    assets = await service.get_assets(is_public_only=public_only)
    return GenericResponse(data=[{
        "id": a.id,
        "type": a.asset_type,
        "title": a.title,
        "url": a.file_url,
        "is_public": a.is_public,
        "created_at": a.created_at
    } for a in assets])

@router.post("/", response_model=GenericResponse[Dict[str, Any]])
async def add_asset(
    asset_in: AssetCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = BrandAssetService(db, current_user)
    asset = await service.add_asset(
        asset_in.asset_type,
        asset_in.title,
        asset_in.file_url,
        asset_in.is_public
    )
    return GenericResponse(data={"id": asset.id, "status": "added"})
