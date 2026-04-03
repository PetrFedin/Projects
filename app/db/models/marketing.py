from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Influencer(Base):
    __tablename__ = "influencers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    handle: Mapped[str] = mapped_column(String, index=True)
    platform: Mapped[str] = mapped_column(String) # instagram, tiktok
    follower_count: Mapped[int] = mapped_column(default=0)
    avg_engagement: Mapped[float] = mapped_column(default=0.0)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class InfluencerCampaign(Base):
    __tablename__ = "influencer_campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    influencer_name: Mapped[str] = mapped_column(String)
    platform: Mapped[str] = mapped_column(String)
    cost: Mapped[float] = mapped_column(Float)
    reach: Mapped[int] = mapped_column(Integer, default=0)
    engagement: Mapped[int] = mapped_column(Integer, default=0)
    clicks: Mapped[int] = mapped_column(Integer, default=0)
    conversions: Mapped[int] = mapped_column(Integer, default=0)
    revenue_generated: Mapped[float] = mapped_column(Float, default=0.0)
    roi: Mapped[float] = mapped_column(Float, default=0.0)
    campaign_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    status: Mapped[str] = mapped_column(String, default="planned") # planned, active, completed
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class CampaignROI(Base):
    __tablename__ = "campaign_roi"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    campaign_id: Mapped[str] = mapped_column(String, index=True)
    influencer_id: Mapped[int] = mapped_column(Integer, index=True)
    items_gifted_json: Mapped[dict] = mapped_column(JSON) # List of SKUs
    total_cost: Mapped[float] = mapped_column(default=0.0)
    total_sales_generated: Mapped[float] = mapped_column(default=0.0)
    roi_percentage: Mapped[float] = mapped_column(default=0.0)

class InfluencerItemTrack(Base):
    __tablename__ = "influencer_item_tracking"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    influencer_id: Mapped[int] = mapped_column(Integer, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    sent_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    return_required: Mapped[bool] = mapped_column(default=False)
    return_status: Mapped[str] = mapped_column(String, default="na") # na, pending, returned, lost
    condition_notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class PRSampleReturn(Base):
    __tablename__ = "pr_sample_returns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    editorial_name: Mapped[str] = mapped_column(String)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    out_date: Mapped[datetime] = mapped_column(DateTime)
    expected_return_date: Mapped[datetime] = mapped_column(DateTime)
    actual_return_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="out") # out, returned, overdue

class CollaborationProject(Base):
    __tablename__ = "collaboration_projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_brand_id: Mapped[str] = mapped_column(String, index=True)
    partner_brand_id: Mapped[str] = mapped_column(String, index=True)
    project_name: Mapped[str] = mapped_column(String)
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    collection_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="active") # active, closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProjectAccessControl(Base):
    __tablename__ = "project_access_controls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    project_id: Mapped[int] = mapped_column(Integer, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    access_level: Mapped[str] = mapped_column(String) # viewer, editor, admin
    resource_type: Mapped[str] = mapped_column(String) # tech_pack, costing, samples, milestones, inventory
    visibility_config: Mapped[dict] = mapped_column(JSON, default=lambda: {"enabled": True}) # stage-specific visibility
