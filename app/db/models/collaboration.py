from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional, Dict
from sqlalchemy import String, DateTime, JSON, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class TeamTask(Base):
    __tablename__ = "team_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    assignee_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    creator_id: Mapped[str] = mapped_column(String, index=True)
    
    title: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="todo") # todo, in_progress, done, cancelled
    priority: Mapped[str] = mapped_column(String, default="medium") # low, medium, high, urgent
    
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Context link (e.g., SKU-123, ORDER-456)
    context_type: Mapped[Optional[str]] = mapped_column(String, nullable=True) # sku, order, sample, linesheet
    context_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, index=True) # Recipient
    organization_id: Mapped[str] = mapped_column(String, index=True)
    
    title: Mapped[str] = mapped_column(String)
    message: Mapped[str] = mapped_column(String)
    notification_type: Mapped[str] = mapped_column(String) # task_assigned, status_change, mention, system
    
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Action link
    action_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
