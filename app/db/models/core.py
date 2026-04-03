from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    full_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    role: Mapped[str] = mapped_column(String, default="buyer")
    is_active: Mapped[bool] = mapped_column(default=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    type: Mapped[str] = mapped_column(String) # brand, buyer, distributor, factory
    is_active: Mapped[bool] = mapped_column(default=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class PlatformDispute(Base):
    __tablename__ = "platform_disputes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    requester_org_id: Mapped[str] = mapped_column(String, index=True)
    target_org_id: Mapped[str] = mapped_column(String, index=True)
    order_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reason: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="open") # open, investigating, resolved, rejected
    resolution_notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class PlatformAnnouncement(Base):
    __tablename__ = "platform_announcements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(String)
    target_role: Mapped[Optional[str]] = mapped_column(String, nullable=True) # e.g., "brand", null for all
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
