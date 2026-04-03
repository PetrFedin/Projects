from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class WardrobeItemBase(BaseModel):
    customer_id: str
    sku_id: str
    condition: str = "new"
    last_worn_at: Optional[datetime] = None
    outfit_id: Optional[int] = None

class WardrobeItemCreate(WardrobeItemBase):
    pass

class WardrobeItem(WardrobeItemBase):
    id: int
    purchase_date: datetime

    model_config = {"from_attributes": True}

class SuggestOutfitRequest(BaseModel):
    customer_id: str
    occasion: str # e.g., "business meeting", "casual date"
    weather_context: Optional[str] = "Sunny, 20C"

class WishlistGroupBase(BaseModel):
    user_id: str
    name: str
    sku_ids_json: Dict # List of SKUs

class WishlistGroupCreate(WishlistGroupBase):
    pass

class WishlistGroup(WishlistGroupBase):
    id: int
    model_config = {"from_attributes": True}

class ReferralProgramBase(BaseModel):
    referrer_id: str
    referred_id: str
    status: str = "pending"
    reward_amount: float = 0.0

class ReferralProgramCreate(ReferralProgramBase):
    pass

class ReferralProgram(ReferralProgramBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class BoxSubscriptionBase(BaseModel):
    customer_id: str
    plan_name: str
    frequency_months: int = 3
    next_delivery_date: datetime
    is_active: bool = True

class BoxSubscriptionCreate(BoxSubscriptionBase):
    pass

class BoxSubscription(BoxSubscriptionBase):
    id: int
    model_config = {"from_attributes": True}
