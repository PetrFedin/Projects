from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class CustomOrderBase(BaseModel):
    customer_id: str
    sku_base: str
    customizations_json: Dict
    measurements_json: Dict
    status: str = "pending"

class CustomOrderCreate(CustomOrderBase):
    pass

class CustomOrder(CustomOrderBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
