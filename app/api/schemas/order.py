from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class OrderItemBase(BaseModel):
    product_name: str
    sku: str
    color: Optional[str] = None
    size_label: Optional[str] = None
    quantity: int = 1
    wholesale_price: float = 0.0

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    model_config = {"from_attributes": True}

class OrderBase(BaseModel):
    organization_id: str # Seller
    buyer_id: str # Buyer Org
    seller_organization_id: Optional[str] = None
    buyer_organization_id: Optional[str] = None
    currency: str = "USD"
    note: Optional[str] = None
    metadata_json: Optional[Dict] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = []

class OrderDraftCreate(BaseModel):
    organization_id: str # Brand
    buyer_id: str
    items: List[Dict] # SKU, quantity, unit_price
    metadata_json: Optional[Dict] = None

class OrderDraftUpdate(BaseModel):
    """Always-On Cart (RepSpark): persist draft between sessions."""
    items: Optional[List[Dict]] = None  # [{sku_id, quantity, unit_price}]
    note: Optional[str] = None
    metadata_json: Optional[Dict] = None

class OrderSchema(OrderBase):
    id: int
    status: str
    total_amount: float
    items_json: Dict
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem] = []

    model_config = {"from_attributes": True}
