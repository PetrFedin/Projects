from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class ContentGenerationBase(BaseModel):
    sku_id: str
    content_type: str
    platform: str
    generated_text: str
    image_url: Optional[str] = None
    status: str = "draft"

class ContentCreate(ContentGenerationBase):
    pass

class ContentGeneration(ContentGenerationBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class GenerateContentRequest(BaseModel):
    sku_id: str
    content_type: str # description, social_post, ad_copy
    platform: str # instagram, tiktok, shopify
    style_context: Optional[str] = "Professional and minimalist"

class ColorStoryBase(BaseModel):
    brand_id: str
    collection_name: str
    palette_json: List[Dict] # List of {name, pantone, hex}

class ColorStoryCreate(ColorStoryBase):
    pass

class ColorStory(ColorStoryBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class UGCPostBase(BaseModel):
    customer_id: str
    sku_id: str
    image_url: str
    caption: Optional[str] = None
    status: str = "pending"

class UGCPostCreate(UGCPostBase):
    pass

class UGCPost(UGCPostBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
