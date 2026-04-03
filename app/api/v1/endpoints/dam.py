from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Any
from datetime import datetime

from app.api import deps
from app.db.models.base import User, MediaAsset as AssetModel
from app.api.schemas.base import GenericResponse
from app.db.repositories.base import BaseRepository
from app.api.schemas.dam import MediaAsset, MediaAssetCreate, AssetProcessingRequest
from app.services.dam_service import DAMService
from app.core.logging import logger

class MediaRepository(BaseRepository[AssetModel]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AssetModel, session, current_user)

router = APIRouter()

@router.get("/", response_model=GenericResponse[List[MediaAsset]])
async def get_assets(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    repo = MediaRepository(db, current_user=current_user)
    assets = await repo.get_all()
    return GenericResponse(data=assets)

@router.post("/", response_model=GenericResponse[MediaAsset])
async def upload_asset(
    asset_in: MediaAssetCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    repo = MediaRepository(db, current_user=current_user)
    new_asset = AssetModel(**asset_in.model_dump())
    created = await repo.create(new_asset)
    return GenericResponse(data=created)

@router.post("/{asset_id}/process", response_model=GenericResponse[MediaAsset])
async def process_asset(
    asset_id: int,
    req: AssetProcessingRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    repo = MediaRepository(db, current_user=current_user)
    asset = await repo.get(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    service = DAMService()
    
    processed_url = asset.original_url
    has_bg_removed = asset.has_background_removed
    has_watermarked = asset.has_watermark
    
    if req.remove_background:
        processed_url = await service.remove_background(asset.id, asset.original_url)
        has_bg_removed = True
        
    if req.apply_watermark:
        processed_url = await service.apply_watermark(asset.id, processed_url)
        has_watermarked = True
        
    # Update asset in DB
    updated = await repo.update(
        asset_id, 
        processed_url=processed_url,
        has_background_removed=has_bg_removed,
        has_watermark=has_watermarked
    )
    
    return GenericResponse(data=updated)

@router.post("/{asset_id}/analyze-trends", response_model=GenericResponse[dict])
async def analyze_asset_trends(
    asset_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MediaRepository(db, current_user=current_user)
    asset = await repo.get(asset_id)
    if not asset:
        logger.error(f"Asset {asset_id} not found for user {current_user.id} in org {current_user.organization_id}")
        # Let's see what IS in the repo
        all_assets = await repo.get_all()
        logger.error(f"Available assets: {[a.id for a in all_assets]} for org {current_user.organization_id}")
        raise HTTPException(status_code=404, detail="Asset not found")
        
    service = DAMService()
    trends = await service.analyze_visual_trends(asset.id, asset.original_url)
    
    # Update asset metadata with trend results
    await repo.update(asset_id, metadata_json=trends)
    
    return GenericResponse(data=trends)

@router.post("/{asset_id}/360-config", response_model=GenericResponse[dict])
async def configure_360_video(
    asset_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    repo = MediaRepository(db, current_user=current_user)
    asset = await repo.get(asset_id)
    if not asset or asset.asset_type != "360_video":
        raise HTTPException(status_code=404, detail="360 Video not found")
        
    service = DAMService()
    config = await service.process_360_video(asset.id, asset.original_url)
    
    # Update asset metadata
    await repo.update(asset_id, metadata_json=config)
    
    return GenericResponse(data=config)
