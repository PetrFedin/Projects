from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class StoreExpense(Base):
    __tablename__ = "store_expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    expense_type: Mapped[str] = mapped_column(String) # rent, utilities, salary, marketing
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="USD")
    period_month: Mapped[int] = mapped_column(Integer) # 1-12
    period_year: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ReplenishmentRequest(Base):
    __tablename__ = "replenishment_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    quantity: Mapped[int] = mapped_column(Integer)
    priority: Mapped[str] = mapped_column(String, default="medium") # low, medium, high
    status: Mapped[str] = mapped_column(String, default="pending") # pending, approved, shipped
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class StaffTraining(Base):
    __tablename__ = "staff_trainings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    course_name: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="enrolled") # enrolled, completed, failed
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class StaffReward(Base):
    __tablename__ = "staff_rewards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    points: Mapped[int] = mapped_column(default=0)
    achievement_name: Mapped[str] = mapped_column(String)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class FootfallMetric(Base):
    __tablename__ = "footfall_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    zone_id: Mapped[str] = mapped_column(String) # e.g., "denim_section", "fitting_rooms"
    visitor_count: Mapped[int] = mapped_column(default=0)
    dwell_time_avg: Mapped[float] = mapped_column(default=0.0) # in seconds
    heatmap_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ARNavigationNode(Base):
    __tablename__ = "ar_navigation_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    node_id: Mapped[str] = mapped_column(String, index=True)
    location_name: Mapped[str] = mapped_column(String)
    coordinates_json: Mapped[dict] = mapped_column(JSON) # {x, y, z}
    beacon_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class StaffShift(Base):
    __tablename__ = "staff_shifts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="scheduled") # scheduled, completed, absent

class ShiftSwapRequest(Base):
    __tablename__ = "shift_swap_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    requester_staff_id: Mapped[str] = mapped_column(String, index=True)
    target_staff_id: Mapped[str] = mapped_column(String, index=True)
    original_shift_id: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, approved, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SalaryAdvance(Base):
    __tablename__ = "salary_advances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String, default="requested") # requested, approved, paid, rejected
    request_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class StaffLeaderboard(Base):
    __tablename__ = "staff_leaderboard"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    points: Mapped[int] = mapped_column(Integer, default=0)
    sales_count: Mapped[int] = mapped_column(Integer, default=0)
    customer_rating: Mapped[float] = mapped_column(Float, default=0.0)
    rank_title: Mapped[str] = mapped_column(String, default="Junior Stylist")
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class FittingRoomBooking(Base):
    __tablename__ = "fitting_room_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    booking_time: Mapped[datetime] = mapped_column(DateTime)
    sku_ids_json: Mapped[dict] = mapped_column(JSON) # Items to prepare
    status: Mapped[str] = mapped_column(String, default="confirmed") # confirmed, cancelled, completed

class CategorySellThrough(Base):
    __tablename__ = "category_sell_through"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    category: Mapped[str] = mapped_column(String)
    sold_qty: Mapped[int] = mapped_column(Integer, default=0)
    stock_initial: Mapped[int] = mapped_column(Integer, default=0)
    sell_through_pct: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ReturnAnalysis(Base):
    __tablename__ = "return_analysis"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    reason_code: Mapped[str] = mapped_column(String) # sizing, defect, late_delivery
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class WishlistGroup(Base):
    __tablename__ = "wishlist_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    sku_ids_json: Mapped[dict] = mapped_column(JSON) # List of SKUs

class ReferralProgram(Base):
    __tablename__ = "referral_programs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    referrer_id: Mapped[str] = mapped_column(String, index=True)
    referred_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, joined, rewarded
    reward_amount: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class GiftRegistry(Base):
    __tablename__ = "gift_registries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    event_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    items: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # List of SKUs with status (purchased/pending)
    is_public: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BoxSubscription(Base):
    __tablename__ = "box_subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    plan_name: Mapped[str] = mapped_column(String) # e.g., "Seasonal Chic"
    frequency_months: Mapped[int] = mapped_column(Integer, default=3)
    next_delivery_date: Mapped[datetime] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(default=True)

class VideoConsultation(Base):
    __tablename__ = "video_consultations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    stylist_id: Mapped[str] = mapped_column(String, index=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    status: Mapped[str] = mapped_column(String, default="scheduled") # scheduled, completed, cancelled
    meeting_link: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class RepairRequest(Base):
    __tablename__ = "repair_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="submitted") # submitted, in_repair, ready, picked_up
    repair_cost: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class StoreInventory(Base):
    __tablename__ = "store_inventory"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    reserved_qty: Mapped[int] = mapped_column(Integer, default=0)
    last_sync: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class POSTransaction(Base):
    __tablename__ = "pos_transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True)
    items_json: Mapped[dict] = mapped_column(JSON) # List of {sku_id, qty, price}
    total_amount: Mapped[float] = mapped_column(Float)
    payment_method: Mapped[str] = mapped_column(String) # card, cash, points
    status: Mapped[str] = mapped_column(String, default="completed") # completed, refunded
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CustomerClienteling(Base):
    __tablename__ = "customer_clienteling"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    interaction_type: Mapped[str] = mapped_column(String) # visit, call, message
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    recommended_skus_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CustomerFeedback(Base):
    __tablename__ = "customer_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    tags_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
