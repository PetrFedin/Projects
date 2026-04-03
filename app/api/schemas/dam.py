from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class MediaAssetBase(BaseModel):
    title: str
    asset_type: str # image, video, 360_video, document
    original_url: str
    metadata_json: Optional[Dict] = None

class MediaAssetCreate(MediaAssetBase):
    organization_id: Optional[str] = None

class MediaAsset(MediaAssetBase):
    id: int
    organization_id: str
    processed_url: Optional[str] = None
    has_background_removed: bool = False
    has_watermark: bool = False
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class AssetProcessingRequest(BaseModel):
    remove_background: bool = False
    apply_watermark: bool = False
