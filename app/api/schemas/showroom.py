from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class ShowroomItemBase(BaseModel):
    product_name: str
    sku: str
    brand_name: str
    color: Optional[str] = None
    size_range: Optional[str] = None
    wholesale_price: float = 0.0
    currency: str = "USD"

class ShowroomItemCreate(ShowroomItemBase):
    pass

class ShowroomItem(ShowroomItemBase):
    id: int
    showroom_id: int
    
    model_config = {"from_attributes": True}

class ShowroomBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True
    season_id: Optional[str] = None
    is_public: bool = False
    access_code: Optional[str] = None
    vr_url: Optional[str] = None
    media_asset_id: Optional[int] = None
    linesheet_id: Optional[int] = None
    metadata_json: Optional[Dict] = None
    # Event microsites (RepSpark)
    showroom_type: str = "standard"  # standard, event
    event_start_date: Optional[datetime] = None
    event_end_date: Optional[datetime] = None
    invite_only: bool = False

class ShowroomCreate(ShowroomBase):
    pass

class ShowroomUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    season_id: Optional[str] = None
    is_public: Optional[bool] = None
    access_code: Optional[str] = None
    vr_url: Optional[str] = None
    metadata_json: Optional[Dict] = None
    showroom_type: Optional[str] = None
    event_start_date: Optional[datetime] = None
    event_end_date: Optional[datetime] = None
    invite_only: Optional[bool] = None

class Showroom(ShowroomBase):
    id: int
    organization_id: str
    created_at: datetime
    updated_at: datetime
    items: List[ShowroomItem] = []

    model_config = {"from_attributes": True}
