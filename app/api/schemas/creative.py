from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime

class LookbookBase(BaseModel):
    brand_id: str
    title: str
    season: str
    items_json: Dict
    ai_story: Optional[str] = None
    is_published: bool = False

class LookbookCreate(LookbookBase):
    pass

class Lookbook(LookbookBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class GenerateLookbookRequest(BaseModel):
    brand_id: str
    skus: List[str]
    season: str
    style_context: Optional[str] = "Chic and modern"

class StyleDNABase(BaseModel):
    customer_id: str
    color_type: str
    silhouette: str
    preferences_json: Dict

class StyleDNACreate(StyleDNABase):
    pass

class StyleDNA(StyleDNABase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class ConsultationBase(BaseModel):
    customer_id: str
    stylist_id: str
    scheduled_at: datetime
    duration_minutes: int = 30
    status: str = "scheduled"
    meeting_link: Optional[str] = None

class ConsultationCreate(ConsultationBase):
    pass

class VideoConsultation(ConsultationBase):
    id: int
    model_config = {"from_attributes": True}

class AIAssetBase(BaseModel):
    lookbook_id: int
    image_url: str
    asset_type: str
    prompt_used: str
    metadata_json: Optional[Dict] = None

class AIAssetCreate(AIAssetBase):
    pass

class AIModelAsset(AIAssetBase):
    id: int
    model_config = {"from_attributes": True}

class VirtualShowBase(BaseModel):
    brand_id: str
    title: str
    scheduled_at: datetime
    streaming_url: str
    preorder_skus_json: List[str]
    status: str = "upcoming"

class VirtualShowCreate(VirtualShowBase):
    pass

class VirtualShowEvent(VirtualShowBase):
    id: int
    model_config = {"from_attributes": True}

class AIStudioAssetBase(BaseModel):
    brand_id: str
    original_url: str
    processed_url: Optional[str] = None
    task_type: str
    status: str = "pending"

class AIStudioAssetCreate(AIStudioAssetBase):
    pass

class AIStudioAsset(AIStudioAssetBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
