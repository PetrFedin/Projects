"""Auction models for samples, overstock, and B2B lots."""

from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


class Auction(Base):
    """Auction event (e.g. samples, overstock, factory lots)."""

    __tablename__ = "auctions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    factory_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)

    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    auction_type: Mapped[str] = mapped_column(String, default="samples")  # samples, overstock, factory

    status: Mapped[str] = mapped_column(String, default="draft")
    starts_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


class AuctionLot(Base):
    """Individual lot within an auction."""

    __tablename__ = "auction_lots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    auction_id: Mapped[int] = mapped_column(Integer, ForeignKey("auctions.id"), index=True)
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)

    title: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    start_price: Mapped[float] = mapped_column(Float, default=0.0)
    current_price: Mapped[float] = mapped_column(Float, default=0.0)
    reserve_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    min_increment: Mapped[float] = mapped_column(Float, default=1.0)

    status: Mapped[str] = mapped_column(String, default="pending")
    winner_org_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    sold_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


class AuctionBid(Base):
    """Bid on an auction lot."""

    __tablename__ = "auction_bids"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lot_id: Mapped[int] = mapped_column(Integer, ForeignKey("auction_lots.id"), index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)

    amount: Mapped[float] = mapped_column(Float)
    is_winner: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
