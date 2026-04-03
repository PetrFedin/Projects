from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True) # Brand
    buyer_id: Mapped[str] = mapped_column(String, index=True) # Buyer Org
    seller_organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    buyer_organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, pending, confirmed, shipped, delivered, cancelled
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    note: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    items_json: Mapped[dict] = mapped_column(JSON) # List of {sku_id, quantity, unit_price}
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), index=True)
    product_name: Mapped[str] = mapped_column(String)
    sku: Mapped[str] = mapped_column(String, index=True)
    color: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    size_label: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    wholesale_price: Mapped[float] = mapped_column(Float, default=0.0)

class CustomOrder(Base):
    __tablename__ = "custom_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    sku_base: Mapped[str] = mapped_column(String)
    customizations_json: Mapped[dict] = mapped_column(JSON) # e.g., {pocket_style: "round", thread_color: "red"}
    measurements_json: Mapped[dict] = mapped_column(JSON) # {chest: 100, waist: 80}
    status: Mapped[str] = mapped_column(String, default="pending") # pending, designing, production, shipped
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BOPISOrder(Base):
    __tablename__ = "bopis_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    order_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, ready, picked_up, cancelled
    items: Mapped[dict] = mapped_column(JSON) # List of SKUs and quantities
    pickup_code: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class RentalOrder(Base):
    __tablename__ = "rental_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    start_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    due_date: Mapped[datetime] = mapped_column(DateTime)
    return_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="rented") # rented, returned, late, damaged
    condition_on_return: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class TransactionSplit(Base):
    __tablename__ = "transaction_splits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    transaction_id: Mapped[str] = mapped_column(String, index=True)
    brand_share: Mapped[float] = mapped_column(default=0.0)
    factory_share: Mapped[float] = mapped_column(default=0.0)
    logistics_share: Mapped[float] = mapped_column(default=0.0)
    platform_fee: Mapped[float] = mapped_column(default=0.0)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, settled

class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="USD")
    conversion_rate_to_usd: Mapped[float] = mapped_column(Float, default=1.0)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, paid, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class PackingList(Base):
    __tablename__ = "packing_lists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    box_number: Mapped[str] = mapped_column(String)
    items_json: Mapped[dict] = mapped_column(JSON) # List of {sku_id, quantity}
    total_weight_kg: Mapped[float] = mapped_column(Float, default=0.0)
    volumetric_weight: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, shipped, received

class CreditMemo(Base):
    __tablename__ = "credit_memos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="issued") # issued, applied
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class WholesaleMessage(Base):
    __tablename__ = "wholesale_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sender_id: Mapped[str] = mapped_column(String, index=True)
    receiver_id: Mapped[str] = mapped_column(String, index=True)
    order_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    message_text: Mapped[str] = mapped_column(String)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class OrderLog(Base):
    __tablename__ = "order_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    action: Mapped[str] = mapped_column(String) # created, updated, status_change
    details_json: Mapped[dict] = mapped_column(JSON)
    user_id: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class B2BDiscount(Base):
    __tablename__ = "b2b_discounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    tier_name: Mapped[str] = mapped_column(String) # Silver, Gold, Platinum
    min_volume: Mapped[int] = mapped_column(Integer)
    discount_percentage: Mapped[float] = mapped_column(Float)

class WholesaleBNPL(Base):
    __tablename__ = "wholesale_bnpl"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    terms_days: Mapped[int] = mapped_column(Integer) # 30, 60, 90
    due_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="active") # active, paid, overdue

class MOQSetting(Base):
    __tablename__ = "moq_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    min_units: Mapped[int] = mapped_column(Integer, default=1)
    min_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    country_code: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)  # ISO 3166-1, None = global


class Quote(Base):
    """B2B price quote: Draft → Sent → Accepted/Expired (SparkLayer, RepSpark style)."""
    __tablename__ = "quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    buyer_id: Mapped[str] = mapped_column(String, index=True)
    quote_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    items_json: Mapped[dict] = mapped_column(JSON)  # [{sku_id, quantity, unit_price}]
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    status: Mapped[str] = mapped_column(String, default="draft")  # draft, sent, accepted, expired
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    note: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class RFQ(Base):
    __tablename__ = "rfqs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_name: Mapped[str] = mapped_column(String, index=True)
    target_quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, sent, compared, closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class RFQVendorQuote(Base):
    __tablename__ = "rfq_vendor_quotes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rfq_id: Mapped[int] = mapped_column(Integer, index=True)
    vendor_id: Mapped[str] = mapped_column(String, index=True)
    price_per_unit: Mapped[float] = mapped_column(Float)
    lead_time_days: Mapped[int] = mapped_column(Integer)
    is_selected: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CustomsDeclaration(Base):
    __tablename__ = "customs_declarations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    declaration_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    hs_codes_json: Mapped[dict] = mapped_column(JSON) # List of HS codes and associated values
    total_duties_usd: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, submitted, cleared, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
