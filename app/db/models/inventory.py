from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class FabricRoll(Base):
    """Specific roll accounting for high-value fabrics."""
    __tablename__ = "fabric_rolls"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    roll_number: Mapped[str] = mapped_column(String, unique=True)
    initial_length_m: Mapped[float] = mapped_column(Float)
    current_length_m: Mapped[float] = mapped_column(Float)
    width_cm: Mapped[float] = mapped_column(Float)
    defects_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # Map of defect coordinates
    factory_id: Mapped[str] = mapped_column(String, index=True) # Location of the roll
    received_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class RawMaterialTransaction(Base):
    """Actual deduction of materials (e.g., from cut-off reports)."""
    __tablename__ = "raw_material_transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    roll_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("fabric_rolls.id"), nullable=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    quantity_used: Mapped[float] = mapped_column(Float)
    efficiency_percent: Mapped[float] = mapped_column(Float) # From markers/nesting
    transaction_type: Mapped[str] = mapped_column(String) # cutting, sampling, damage
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class TollMaterialBalance(Base):
    """Balance of 'давальческое сырье' on factory side."""
    __tablename__ = "toll_material_balances"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    quantity_on_hand: Mapped[float] = mapped_column(Float, default=0.0)
    reserved_for_batches_json: Mapped[dict] = mapped_column(JSON, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class MaterialLot(Base):
    """Detailed accounting for any raw material (trims, yarn, etc.) by batch/lot."""
    __tablename__ = "material_lots"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True) # ID from MaterialMaster
    lot_number: Mapped[str] = mapped_column(String, index=True)
    vendor_batch_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    quantity_initial: Mapped[float] = mapped_column(Float)
    quantity_current: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String) # m, kg, pcs
    location_id: Mapped[str] = mapped_column(String, index=True) # Warehouse or Factory ID
    expiry_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="available") # available, reserved, quarantined
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class FinishedGoodsStock(Base):
    """Inventory of produced items ready for shipment."""
    __tablename__ = "finished_goods_stock"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    production_batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    color: Mapped[str] = mapped_column(String, index=True)
    size: Mapped[str] = mapped_column(String, index=True)
    qty_on_hand: Mapped[int] = mapped_column(Integer, default=0)
    qty_allocated: Mapped[int] = mapped_column(Integer, default=0) # Reserved for specific orders
    warehouse_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class StockAllocation(Base):
    """Specific reservation of finished goods for a B2B order."""
    __tablename__ = "stock_allocations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    stock_id: Mapped[int] = mapped_column(Integer, ForeignKey("finished_goods_stock.id"), index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), index=True)
    qty_reserved: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="reserved") # reserved, shipped, released
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialConsumptionTrace(Base):
    """Genealogy: exactly which material lot went into which production batch."""
    __tablename__ = "material_consumption_traces"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    lot_id: Mapped[int] = mapped_column(Integer, ForeignKey("material_lots.id"), index=True)
    qty_consumed: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialAllowance(Base):
    """Нормы списания (allowance) по операциям: ткань, нитки, подкладка, кромка."""
    __tablename__ = "material_allowances"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    operation: Mapped[str] = mapped_column(String)  # fabric, thread, lining, selvage
    allowance_percent: Mapped[float] = mapped_column(Float, default=0.0)
    unit: Mapped[str] = mapped_column(String, default="m")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialSubstitute(Base):
    """Субституты материалов при дефиците."""
    __tablename__ = "material_substitutes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    substitute_material_id: Mapped[str] = mapped_column(String, index=True)
    priority: Mapped[int] = mapped_column(Integer, default=1)  # 1 = first choice
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialReorderPoint(Base):
    """Минимальные остатки и закупочные точки (reorder point)."""
    __tablename__ = "material_reorder_points"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    location_id: Mapped[str] = mapped_column(String, index=True)
    min_qty: Mapped[float] = mapped_column(Float)
    reorder_qty: Mapped[float] = mapped_column(Float)
    safety_stock: Mapped[float] = mapped_column(Float, default=0.0)
    unit: Mapped[str] = mapped_column(String, default="m")
    lead_time_days: Mapped[int] = mapped_column(Integer, default=7)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class CrossAllocation(Base):
    """Кросс-списание между цветами/артикулами при изменениях ассортимента."""
    __tablename__ = "cross_allocations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_sku_id: Mapped[str] = mapped_column(String, index=True)
    target_sku_id: Mapped[str] = mapped_column(String, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    quantity: Mapped[float] = mapped_column(Float)
    reason: Mapped[str] = mapped_column(String)  # color_change, size_run_change, etc.
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)  # FK to production_batches
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProductionMaterialPlanning(Base):
    """Planning: how much material we NEED vs how much we ALLOCATED from lots."""
    __tablename__ = "production_material_planning"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    # Total needed based on BOM * (planned units per size)
    required_qty: Mapped[float] = mapped_column(Float)
    # Total reserved from existing MaterialLots
    reserved_qty: Mapped[float] = mapped_column(Float, default=0.0)
    # Link to specific lots: [{"lot_id": 12, "reserved_qty": 500}, ...]
    reservations_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    unit: Mapped[str] = mapped_column(String)
    # Gap (required - reserved)
    shortage_qty: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, fully_reserved, shortfall
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)
