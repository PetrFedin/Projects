from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class InfluencerBase(BaseModel):
    handle: str
    platform: str
    follower_count: int = 0
    avg_engagement: float = 0.0
    metadata_json: Optional[Dict] = None

class InfluencerCreate(InfluencerBase):
    pass

class Influencer(InfluencerBase):
    id: int

    model_config = {"from_attributes": True}

class CampaignROIResult(BaseModel):
    campaign_id: str
    total_roi: float
    total_sales: float

class InfluencerCampaignBase(BaseModel):
    brand_id: str
    influencer_name: str
    platform: str
    cost: float
    reach: int = 0
    engagement: int = 0
    clicks: int = 0
    conversions: int = 0
    revenue_generated: float = 0.0
    roi: float = 0.0
    campaign_date: datetime
    status: str = "planned"
    metadata_json: Optional[Dict] = None

class InfluencerCampaignCreate(InfluencerCampaignBase):
    pass

class InfluencerCampaign(InfluencerCampaignBase):
    id: int
    model_config = {"from_attributes": True}

class SEOCopyBase(BaseModel):
    sku_id: str
    language: str
    tone_of_voice: str
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class SEOCopyCreate(SEOCopyBase):
    pass

class SEOCopy(SEOCopyBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class InfluencerItemBase(BaseModel):
    influencer_id: int
    sku_id: str
    return_required: bool = False
    return_status: str = "na"
    condition_notes: Optional[str] = None

class InfluencerItemCreate(InfluencerItemBase):
    pass

class InfluencerItemTrack(InfluencerItemBase):
    id: int
    sent_at: datetime
    model_config = {"from_attributes": True}

class PRSampleBase(BaseModel):
    editorial_name: str
    sku_id: str
    out_date: datetime
    expected_return_date: datetime
    status: str = "out"

class PRSampleCreate(PRSampleBase):
    pass

class PRSampleReturn(PRSampleBase):
    id: int
    actual_return_date: Optional[datetime] = None
    model_config = {"from_attributes": True}
