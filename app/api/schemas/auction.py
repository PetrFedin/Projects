"""Auction API schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class AuctionBase(BaseModel):
    title: str
    description: Optional[str] = None
    auction_type: str = "samples"
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None


class AuctionCreate(AuctionBase):
    brand_id: Optional[str] = None
    factory_id: Optional[str] = None


class AuctionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None


class AuctionSchema(AuctionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    organization_id: str
    brand_id: Optional[str] = None
    factory_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime


class LotBase(BaseModel):
    title: str
    description: Optional[str] = None
    sku_id: Optional[str] = None
    batch_id: Optional[str] = None
    quantity: int = 1
    start_price: float = 0.0
    reserve_price: Optional[float] = None
    min_increment: float = 1.0


class LotCreate(LotBase):
    pass


class LotSchema(LotBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    auction_id: int
    current_price: float
    status: str
    winner_org_id: Optional[str] = None
    sold_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class BidCreate(BaseModel):
    amount: float = Field(gt=0)


class BidSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lot_id: int
    organization_id: str
    amount: float
    is_winner: bool
    created_at: datetime
