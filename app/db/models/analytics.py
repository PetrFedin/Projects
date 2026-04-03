"""
Fashion Planning & Procurement Analytics — Data Warehouse Style Layer.

Phase 1: Dimension, Fact, and Snapshot tables.
Additive to existing models; no foreign keys to existing tables (reference by business keys).
Tables are populated by ETL/jobs from orders, inventory, retail, finance, intelligence.
"""
from datetime import datetime, date
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, Date, JSON, Integer, Float, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


# ---------------------------------------------------------------------------
# DIMENSION TABLES (stable over time; id + name + attributes + metadata)
# ---------------------------------------------------------------------------

class DimProduct(Base):
    __tablename__ = "analytics_dim_products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[str] = mapped_column(String, unique=True, index=True)  # business key
    name: Mapped[str] = mapped_column(String, index=True)
    category_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    collection_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    valid_from: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    valid_to: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimSku(Base):
    __tablename__ = "analytics_dim_skus"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    product_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String, index=True)
    color: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    season_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    valid_from: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    valid_to: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimBrand(Base):
    __tablename__ = "analytics_dim_brands"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimCategory(Base):
    __tablename__ = "analytics_dim_categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    parent_category_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimCollection(Base):
    __tablename__ = "analytics_dim_collections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    collection_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    season_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimSeason(Base):
    __tablename__ = "analytics_dim_seasons"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    season_id: Mapped[str] = mapped_column(String, unique=True, index=True)  # e.g. FW26, SS27
    name: Mapped[str] = mapped_column(String, index=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimStore(Base):
    __tablename__ = "analytics_dim_stores"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    region_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimRegion(Base):
    __tablename__ = "analytics_dim_regions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    region_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    parent_region_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimSupplier(Base):
    __tablename__ = "analytics_dim_suppliers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    supplier_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


class DimBuyer(Base):
    __tablename__ = "analytics_dim_buyers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    buyer_id: Mapped[str] = mapped_column(String, unique=True, index=True)  # org or user
    name: Mapped[str] = mapped_column(String, index=True)
    region_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    attributes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)


# ---------------------------------------------------------------------------
# FACT TABLES (measurable activity; append-only)
# ---------------------------------------------------------------------------

class FactSales(Base):
    __tablename__ = "analytics_fact_sales"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    sale_date: Mapped[date] = mapped_column(Date, index=True)
    units_sold: Mapped[int] = mapped_column(Integer, default=0)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    discount: Mapped[float] = mapped_column(Float, default=0.0)
    margin: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String, default="USD")
    source_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)  # pos_transaction id / order id
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_fact_sales_sku_date", "sku_id", "sale_date"),)


class FactOrder(Base):
    __tablename__ = "analytics_fact_orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)  # references orders.id or external id
    brand_id: Mapped[str] = mapped_column(String, index=True)
    buyer_id: Mapped[str] = mapped_column(String, index=True)
    season_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    order_date: Mapped[date] = mapped_column(Date, index=True)
    order_value: Mapped[float] = mapped_column(Float, default=0.0)
    order_units: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    status: Mapped[str] = mapped_column(String, index=True, default="confirmed")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_fact_orders_brand_buyer_date", "brand_id", "buyer_id", "order_date"),)


class FactInventory(Base):
    __tablename__ = "analytics_fact_inventory"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    warehouse_id: Mapped[str] = mapped_column(String, index=True)  # store or warehouse
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    stock_units: Mapped[int] = mapped_column(Integer, default=0)
    stock_value: Mapped[float] = mapped_column(Float, default=0.0)
    reserved_units: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_fact_inventory_sku_wh_date", "sku_id", "warehouse_id", "snapshot_date"),)


class FactPurchase(Base):
    __tablename__ = "analytics_fact_purchases"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    purchase_order_id: Mapped[str] = mapped_column(String, index=True)
    supplier_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    purchase_date: Mapped[date] = mapped_column(Date, index=True)
    cost: Mapped[float] = mapped_column(Float, default=0.0)
    units: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class FactReturn(Base):
    __tablename__ = "analytics_fact_returns"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[str] = mapped_column(String, index=True)
    return_date: Mapped[date] = mapped_column(Date, index=True)
    return_units: Mapped[int] = mapped_column(Integer, default=0)
    return_value: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    source_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_fact_returns_sku_store_date", "sku_id", "store_id", "return_date"),)


# ---------------------------------------------------------------------------
# SNAPSHOT TABLES (periodic state for planning & performance)
# ---------------------------------------------------------------------------

class SnapshotSellthrough(Base):
    __tablename__ = "analytics_snapshot_sellthrough"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    season_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    sold_units: Mapped[int] = mapped_column(Integer, default=0)
    received_units: Mapped[int] = mapped_column(Integer, default=0)
    sellthrough_rate: Mapped[float] = mapped_column(Float, default=0.0)
    days_on_sale: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_sellthrough_sku_season_date", "sku_id", "season_id", "snapshot_date"),)


class SnapshotInventory(Base):
    __tablename__ = "analytics_snapshot_inventory"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    warehouse_id: Mapped[str] = mapped_column(String, index=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    stock_units: Mapped[int] = mapped_column(Integer, default=0)
    stock_value: Mapped[float] = mapped_column(Float, default=0.0)
    weeks_of_supply: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_inventory_sku_wh_date", "sku_id", "warehouse_id", "snapshot_date"),)


class SnapshotBudget(Base):
    __tablename__ = "analytics_snapshot_budget"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    season_id: Mapped[str] = mapped_column(String, index=True)
    category_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    planned_budget: Mapped[float] = mapped_column(Float, default=0.0)
    actual_spend: Mapped[float] = mapped_column(Float, default=0.0)
    remaining_budget: Mapped[float] = mapped_column(Float, default=0.0)
    utilization_pct: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_budget_brand_season_date", "brand_id", "season_id", "snapshot_date"),)


class SnapshotAssortment(Base):
    __tablename__ = "analytics_snapshot_assortment"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    store_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    season_id: Mapped[str] = mapped_column(String, index=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    option_count: Mapped[int] = mapped_column(Integer, default=0)
    total_units: Mapped[int] = mapped_column(Integer, default=0)
    target_option_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    target_depth: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_assortment_store_season_date", "store_id", "season_id", "snapshot_date"),)


class SnapshotCategoryPerformance(Base):
    __tablename__ = "analytics_snapshot_category_performance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    category_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    season_id: Mapped[str] = mapped_column(String, index=True)
    store_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    units_sold: Mapped[int] = mapped_column(Integer, default=0)
    sellthrough_pct: Mapped[float] = mapped_column(Float, default=0.0)
    margin_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_cat_perf_cat_season_date", "category_id", "season_id", "snapshot_date"),)


class SnapshotBrandPerformance(Base):
    __tablename__ = "analytics_snapshot_brand_performance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    season_id: Mapped[str] = mapped_column(String, index=True)
    region_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    snapshot_date: Mapped[date] = mapped_column(Date, index=True)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    order_count: Mapped[int] = mapped_column(Integer, default=0)
    order_units: Mapped[int] = mapped_column(Integer, default=0)
    sellthrough_pct: Mapped[float] = mapped_column(Float, default=0.0)
    margin_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    __table_args__ = (Index("ix_analytics_snapshot_brand_perf_brand_season_date", "brand_id", "season_id", "snapshot_date"),)
