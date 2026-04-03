from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaterialLeftoverBase(BaseModel):
    supplier_id: str
    material_name: str
    quantity: float
    unit: str
    price_per_unit: float
    composition: Optional[str] = None
    status: str = "available"

class MaterialLeftoverCreate(MaterialLeftoverBase):
    pass

class MaterialLeftover(MaterialLeftoverBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class SubscriptionPlanBase(BaseModel):
    name: str
    price_monthly: float
    items_limit: int
    description: Optional[str] = None

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    model_config = {"from_attributes": True}

class RentalOrderBase(BaseModel):
    customer_id: str
    sku_id: str
    due_date: datetime
    status: str = "rented"

class RentalOrderCreate(RentalOrderBase):
    pass

class RentalOrder(RentalOrderBase):
    id: int
    start_date: datetime
    return_date: Optional[datetime] = None
    condition_on_return: Optional[str] = None
    model_config = {"from_attributes": True}

class CircularItemBase(BaseModel):
    sku_id: str
    serial_number: str
    current_condition: str = "excellent"
    is_active: bool = True

class CircularItemCreate(CircularItemBase):
    pass

class CircularItem(CircularItemBase):
    id: int
    rental_count: int
    total_revenue_generated: float
    model_config = {"from_attributes": True}
