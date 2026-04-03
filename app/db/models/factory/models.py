from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from ..base import Base

class MachineTelemetry(Base):
    __tablename__ = "machine_telemetry"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    machine_id: Mapped[str] = mapped_column(String, index=True)
    status: Mapped[str] = mapped_column(String) # active, idle, maintenance, offline
    oee: Mapped[float] = mapped_column(default=0.0) # Overall Equipment Effectiveness
    power_consumption: Mapped[float] = mapped_column(default=0.0)
    speed_rpm: Mapped[int] = mapped_column(default=0)
    operator_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class NeedleCounter(Base):
    __tablename__ = "needle_counters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    machine_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    cycle_count: Mapped[int] = mapped_column(Integer, default=0)
    last_replaced_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ChemicalAudit(Base):
    __tablename__ = "chemical_audits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    chemical_name: Mapped[str] = mapped_column(String)
    reach_compliant: Mapped[bool] = mapped_column(default=True)
    oeko_tex_certified: Mapped[bool] = mapped_column(default=True)
    last_audit_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProductionMilestone(Base):
    __tablename__ = "production_milestones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    milestone_name: Mapped[str] = mapped_column(String) # PPS, Bulk Start, Bulk End
    target_date: Mapped[datetime] = mapped_column(DateTime)
    actual_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, achieved, delayed
    responsible_user_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("users.id"), nullable=True)

class ProductionSchedule(Base):
    __tablename__ = "production_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    gantt_data_json: Mapped[dict] = mapped_column(JSON) # { "stages": [{"name": "Cutting", "start": "...", "end": "..."}, ...] }
    capacity_usage_percent: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class PredictiveCapacity(Base):
    __tablename__ = "predictive_capacities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    historical_avg_delay_days: Mapped[float] = mapped_column(Float, default=0.0)
    defect_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    current_backlog_hours: Mapped[int] = mapped_column(Integer, default=0)
    predicted_availability_date: Mapped[datetime] = mapped_column(DateTime)
    ai_confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class FactoryCapacityBooking(Base):
    __tablename__ = "factory_capacity_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    month: Mapped[int] = mapped_column(Integer) # 1-12
    year: Mapped[int] = mapped_column(Integer)
    units_reserved: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="confirmed") # requested, confirmed, cancelled

class SupplyChainTA(Base):
    __tablename__ = "supply_chain_ta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    milestone_name: Mapped[str] = mapped_column(String) # lab_dip, bulk_fabric, sewing_start
    planned_date: Mapped[datetime] = mapped_column(DateTime)
    actual_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, delayed, completed

class QCChecklist(Base):
    __tablename__ = "qc_checklists"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    checklist_json: Mapped[dict] = mapped_column(JSON) # 10 items with status
    inspector_id: Mapped[str] = mapped_column(String)
    overall_status: Mapped[str] = mapped_column(String, default="pending") # pass, fail
    defect_report_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ESGMetric(Base):
    __tablename__ = "esg_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    waste_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    energy_consumption_kwh: Mapped[float] = mapped_column(Float, default=0.0)
    water_usage_liters: Mapped[float] = mapped_column(Float, default=0.0)
    carbon_footprint_kg: Mapped[float] = mapped_column(Float, default=0.0)
    period_month: Mapped[int] = mapped_column(Integer)
    period_year: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True) # The brand/org that works with this supplier
    name: Mapped[str] = mapped_column(String, index=True)
    supplier_type: Mapped[str] = mapped_column(String) # fabric, factory, trims, logistics
    rating: Mapped[float] = mapped_column(default=0.0) # Quality Score (0-100)
    reliability_score: Mapped[float] = mapped_column(default=0.0) # Delivery reliability (0-100)
    contact_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SupplierScorecard(Base):
    """Aggregated performance metrics for a supplier over a period."""
    __tablename__ = "supplier_scorecards"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    period_start: Mapped[datetime] = mapped_column(DateTime)
    period_end: Mapped[datetime] = mapped_column(DateTime)
    
    avg_delay_days: Mapped[float] = mapped_column(Float, default=0.0)
    defect_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    compliance_score: Mapped[float] = mapped_column(Float, default=0.0) # Based on certificates
    financial_reliability: Mapped[float] = mapped_column(Float, default=0.0)
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    
    total_orders_analyzed: Mapped[int] = mapped_column(Integer, default=0)
    total_items_delivered: Mapped[int] = mapped_column(Integer, default=0)
    total_defects_found: Mapped[int] = mapped_column(Integer, default=0)
    
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SupplierRFQ(Base):
    """Request for Quotation - comparing offers from multiple suppliers."""
    __tablename__ = "supplier_rfqs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, open, closed, awarded, cancelled
    deadline: Mapped[datetime] = mapped_column(DateTime)
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SupplierRFQItem(Base):
    """Items requested in an RFQ."""
    __tablename__ = "supplier_rfq_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rfq_id: Mapped[int] = mapped_column(Integer, ForeignKey("supplier_rfqs.id"), index=True)
    material_name: Mapped[str] = mapped_column(String)
    specification_json: Mapped[dict] = mapped_column(JSON) # Weight, composition, etc.
    target_quantity: Mapped[float] = mapped_column(Float)
    target_unit: Mapped[str] = mapped_column(String) # m, kg, pcs
    target_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

class SupplierOffer(Base):
    """Response from a supplier to an RFQ."""
    __tablename__ = "supplier_offers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rfq_id: Mapped[int] = mapped_column(Integer, ForeignKey("supplier_rfqs.id"), index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    total_price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    lead_time_days: Mapped[int] = mapped_column(Integer)
    valid_until: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="submitted") # submitted, shortlisted, accepted, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ComplianceCertificate(Base):
    """Legal documents (EAC, ISO, Oeko-Tex, Fire safety)."""
    __tablename__ = "compliance_certificates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    supplier_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("suppliers.id"), nullable=True)
    material_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    cert_type: Mapped[str] = mapped_column(String) # EAC, ISO, OEKO-TEX, GRS, FIRE_SAFETY
    cert_number: Mapped[str] = mapped_column(String, index=True)
    valid_from: Mapped[datetime] = mapped_column(DateTime)
    valid_until: Mapped[datetime] = mapped_column(DateTime)
    document_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="active") # active, expired, pending_renewal
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class SupplierContract(Base):
    """Long-term agreements for material volumes and fixed prices."""
    __tablename__ = "supplier_contracts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    contract_number: Mapped[str] = mapped_column(String, unique=True)
    
    material_id: Mapped[str] = mapped_column(String, index=True) # Material from master
    total_volume_committed: Mapped[float] = mapped_column(Float)
    volume_ordered: Mapped[float] = mapped_column(Float, default=0.0)
    fixed_price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    
    start_date: Mapped[datetime] = mapped_column(DateTime)
    end_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="active") # active, completed, expired
    
    warning_threshold_percent: Mapped[float] = mapped_column(Float, default=80.0) # Warn when 80% used
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class LetterOfCredit(Base):
    """Financial instrument tracking for international sourcing."""
    __tablename__ = "letters_of_credit"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    material_order_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("material_orders.id"), nullable=True)
    lc_number: Mapped[str] = mapped_column(String, unique=True)
    issuing_bank: Mapped[str] = mapped_column(String)
    beneficiary_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"))
    amount: Mapped[float] = mapped_column(Float)
    expiry_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String, default="issued") # issued, advised, negotiated, paid
    document_urls_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # Bill of lading, etc.

class AQLStandard(Base):
    """ISO 2859-1 tables for sampling and acceptance/rejection levels."""
    __tablename__ = "aql_standards"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lot_size_min: Mapped[int] = mapped_column(Integer)
    lot_size_max: Mapped[int] = mapped_column(Integer)
    inspection_level: Mapped[str] = mapped_column(String) # G1, G2, G3
    sample_size: Mapped[int] = mapped_column(Integer)
    accept_limit: Mapped[int] = mapped_column(Integer) # Max defects to pass
    reject_limit: Mapped[int] = mapped_column(Integer) # Min defects to fail
    aql_level: Mapped[float] = mapped_column(Float) # 1.0, 1.5, 2.5, 4.0

class PaymentMilestone(Base):
    """Financial steps tied to production or sourcing milestones."""
    __tablename__ = "payment_milestones"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    material_order_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("material_orders.id"), nullable=True)
    
    milestone_name: Mapped[str] = mapped_column(String) # Deposit, Lab Dip Approved, PPS Approved, Shipment, Final
    percentage: Mapped[float] = mapped_column(Float) # 0 to 100
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    
    linked_production_milestone_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_milestones.id"), nullable=True)
    
    due_date: Mapped[datetime] = mapped_column(DateTime)
    actual_payment_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="planned") # planned, invoiced, paid, overdue
    invoice_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    payment_reference: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class MaterialOrder(Base):
    __tablename__ = "material_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, index=True)
    material_name: Mapped[str] = mapped_column(String)
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String) # m, kg, pcs
    total_price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    status: Mapped[str] = mapped_column(String, default="ordered") # ordered, paid, in_transit, received
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class LabDip(Base):
    __tablename__ = "lab_dips"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_order_id: Mapped[int] = mapped_column(Integer, index=True)
    color_name: Mapped[str] = mapped_column(String)
    pantone_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, approved, rejected
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class AISourcingMatch(Base):
    __tablename__ = "ai_sourcing_matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    sku_category: Mapped[str] = mapped_column(String)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    match_score: Mapped[float] = mapped_column(Float) # 0.0 to 1.0
    reasoning_json: Mapped[dict] = mapped_column(JSON) # AI's explanation for the match
    status: Mapped[str] = mapped_column(String, default="suggested") # suggested, contacted, contracted

class SampleOrder(Base):
    __tablename__ = "sample_orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    sample_type: Mapped[str] = mapped_column(String) # Prototype 1, Prototype 2, SMS, Gold
    status: Mapped[str] = mapped_column(String, default="ordered") # ordered, in_production, shipped, received, approved, rejected
    comments_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # List of comments with timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MachineMaintenance(Base):
    __tablename__ = "machine_maintenance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    machine_id: Mapped[str] = mapped_column(String, index=True)
    last_service_date: Mapped[datetime] = mapped_column(DateTime)
    next_service_date: Mapped[datetime] = mapped_column(DateTime)
    technician_id: Mapped[str] = mapped_column(String)
    parts_replaced_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    cost: Mapped[float] = mapped_column(Float, default=0.0)

class StandardMinuteValue(Base):
    """Timing for every operation in the production process."""
    __tablename__ = "smv_registry"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    operation_name: Mapped[str] = mapped_column(String) # e.g., "Sewing Collar"
    minutes: Mapped[float] = mapped_column(Float)
    labor_rate_per_min: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")

class QualityDefectMap(Base):
    """Heatmap data for defects on a garment."""
    __tablename__ = "quality_defect_maps"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    coordinate_x: Mapped[float] = mapped_column(Float)
    coordinate_y: Mapped[float] = mapped_column(Float)
    defect_type: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String) # minor, major, critical
    inspector_id: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SubcontractorMovement(Base):
    """Tracking semi-finished goods between factories (e.g., Sewing -> Embroidery)."""
    __tablename__ = "subcontractor_movements"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    source_factory_id: Mapped[str] = mapped_column(String)
    target_factory_id: Mapped[str] = mapped_column(String)
    quantity: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="in_transit")
    sent_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    received_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class ProductionStage(Base):
    """Specific instantiated stage of production for a SKU/Batch."""
    __tablename__ = "production_stages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    stage_name: Mapped[str] = mapped_column(String) # Cutting, Sewing, QC, Packing
    sequence_order: Mapped[int] = mapped_column(Integer) # For step-by-step logic
    
    # Assignment
    partner_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("suppliers.id"), nullable=True)
    responsible_staff_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True) # Specific seamstress or manager
    responsible_staff_name: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Manual entry fallback
    
    # Timing
    planned_start_date: Mapped[datetime] = mapped_column(DateTime)
    planned_end_date: Mapped[datetime] = mapped_column(DateTime)
    actual_start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    actual_end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Status & Progress
    status: Mapped[str] = mapped_column(String, default="pending") # pending, in_progress, ready_for_review, completed, blocked
    readiness_percent: Mapped[float] = mapped_column(Float, default=0.0)
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Notes & Interaction
    last_comment: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    has_open_questions: Mapped[bool] = mapped_column(Boolean, default=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ProductionBatch(Base):
    __tablename__ = "production_batches"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[str] = mapped_column(String, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    planned_qty: Mapped[int] = mapped_column(Integer)
    # Size breakdown: {"S": 20, "M": 50, "L": 30}
    size_breakdown_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    actual_qty: Mapped[int] = mapped_column(Integer, default=0)
    # Actual qty per size: {"S": 18, "M": 49, "L": 30}
    actual_size_qty_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    defect_qty: Mapped[int] = mapped_column(Integer, default=0)
    # Defect qty per size: {"S": 2, "M": 1}
    defect_size_qty_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, in_progress, completed, paused
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    responsible_user_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("users.id"), nullable=True)

class ProductionMessage(Base):
    """Contextual chat messages for production communication (Entity-Threaded)."""
    __tablename__ = "production_messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # The entity being discussed (e.g., "defect", "milestone", "rfq")
    entity_type: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    entity_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    sender_id: Mapped[str] = mapped_column(String, index=True)
    sender_role: Mapped[str] = mapped_column(String) # brand, factory, logistics
    content: Mapped[str] = mapped_column(String)
    attachment_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProductionOperation(Base):
    """Real-time tracking of specific operations within a batch (e.g., Sewing Sleeve)."""
    __tablename__ = "production_operations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    operation_name: Mapped[str] = mapped_column(String) # Linked to SMV registry
    operator_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    machine_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    units_completed: Mapped[int] = mapped_column(Integer, default=0)
    units_defective: Mapped[int] = mapped_column(Integer, default=0)
    start_time: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="in_progress") # in_progress, completed, paused

class TechnicalSignOff(Base):
    """Formal approval steps for technical quality (Lab Dip, PPS, Gold Sample)."""
    __tablename__ = "technical_sign_offs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    stage: Mapped[str] = mapped_column(String) # lab_dip, pps, wear_test, bulk_fabric, shipping_sample
    requested_by: Mapped[str] = mapped_column(String)
    approved_by: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, approved, rejected, revision_needed
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    artifact_url: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Photo or report link
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    signed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class MachineSettingRegistry(Base):
    """Exact technical parameters for machines to replicate quality across factories."""
    __tablename__ = "machine_settings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    operation_name: Mapped[str] = mapped_column(String)
    machine_type: Mapped[str] = mapped_column(String) # e.g., "Overlock 4-thread"
    settings_json: Mapped[dict] = mapped_column(JSON) # e.g., {"tension": 4.5, "stitch_density": 12, "needle": "90/14"}
    thread_spec_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # Brand, color, thickness
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ProductionStageTemplate(Base):
    """Standardized workflows for different garment types (e.g., T-shirt vs Heavy Jacket)."""
    __tablename__ = "production_stage_templates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String) # e.g., "Standard Outerwear Workflow"
    category: Mapped[str] = mapped_column(String) # outerwear, knitwear, accessories
    stages_json: Mapped[dict] = mapped_column(JSON) # List of ordered stages with default durations

class QCInspectionDetailed(Base):
    """Deep quality inspection record with specific defect categories."""
    __tablename__ = "qc_inspections_detailed"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    inspection_type: Mapped[str] = mapped_column(String) # inline, end_of_line, final_aql
    sample_size: Mapped[int] = mapped_column(Integer)
    defects_json: Mapped[dict] = mapped_column(JSON) # {"broken_stitch": 2, "stain": 1, "shading": 0}
    result: Mapped[str] = mapped_column(String) # pass, fail, pending_rework
    inspector_id: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class LogisticsPreShipment(Base):
    """Final step: preparing production for B2B shipping."""
    __tablename__ = "logistics_pre_shipment"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    total_boxes: Mapped[int] = mapped_column(Integer)
    gross_weight_kg: Mapped[float] = mapped_column(Float)
    packing_list_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    shipping_mark_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # Barcodes, destination
    status: Mapped[str] = mapped_column(String, default="ready") # ready, shipped, delivered

class DefectReport(Base):
    """Systemic analysis of production waste and defects."""
    __tablename__ = "defect_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    total_rejected_qty: Mapped[int] = mapped_column(Integer, default=0)
    rework_qty: Mapped[int] = mapped_column(Integer, default=0)
    scrap_qty: Mapped[int] = mapped_column(Integer, default=0)
    root_cause_analysis: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    action_taken: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    loss_value: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="RUB")

class StandardOperationMaster(Base):
    """Master reference for sewing/cutting operations (SMV Database)."""
    __tablename__ = "operation_master"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String) # sewing, cutting, finishing, packing
    default_smv: Mapped[float] = mapped_column(Float)
    recommended_machine_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class MaterialMaster(Base):
    """Global material catalog for the organization."""
    __tablename__ = "material_master"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    composition: Mapped[str] = mapped_column(String)
    weight_gsm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    width_cm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    unit: Mapped[str] = mapped_column(String, default="m")
    default_price: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="RUB")

class SizeGridMaster(Base):
    """Global library of size grids (EU, US, RU, IT)."""
    __tablename__ = "size_grid_master"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True) # e.g., "EU Standard Women"
    region: Mapped[str] = mapped_column(String) # EU, US, RU, IT
    sizes_json: Mapped[dict] = mapped_column(JSON) # ["XS", "S", "M", "L", "XL"]
    conversion_formulas_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class ColorLibrary(Base):
    """Master color library with Pantone synchronization."""
    __tablename__ = "color_library"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String, index=True) # Brand color name
    pantone_code: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    hex_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    lab_dip_history_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # History of approvals


# --- Cutting & Markers (1. Раскрой и маркеры) ---
class CuttingMarker(Base):
    """Маркер-листы с учётом дефектов рулонов, nesting efficiency."""
    __tablename__ = "cutting_markers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    roll_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("fabric_rolls.id"), nullable=True)
    marker_number: Mapped[str] = mapped_column(String, index=True)
    planned_length_m: Mapped[float] = mapped_column(Float)
    actual_length_m: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    efficiency_percent: Mapped[float] = mapped_column(Float, default=0.0)
    selvage_cm: Mapped[float] = mapped_column(Float, default=0.0)  # учёт кромок
    waste_m: Mapped[float] = mapped_column(Float, default=0.0)  # обрезки
    defect_zones_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)  # учёт дефектов
    status: Mapped[str] = mapped_column(String, default="draft")  # draft, approved, cut
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CuttingReport(Base):
    """Отчёт раскроя: связь с RawMaterialTransaction, валидация vs BOM."""
    __tablename__ = "cutting_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    marker_id: Mapped[int] = mapped_column(Integer, ForeignKey("cutting_markers.id"), index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    raw_material_transaction_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    bom_planned_m: Mapped[float] = mapped_column(Float)
    actual_used_m: Mapped[float] = mapped_column(Float)
    variance_percent: Mapped[float] = mapped_column(Float, default=0.0)
    validation_status: Mapped[str] = mapped_column(String, default="ok")  # ok, over, under
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


# --- Operation breakdown, Inline QC, Rework (3. Производственные операции) ---
class OperationBreakdown(Base):
    """Операционные листы: SMV/SAM, последовательность операций, привязка к машинкам."""
    __tablename__ = "operation_breakdowns"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    operation_code: Mapped[str] = mapped_column(String, index=True)
    sequence_order: Mapped[int] = mapped_column(Integer)
    smv: Mapped[float] = mapped_column(Float)  # Standard Minute Value
    machine_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    machine_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    category: Mapped[str] = mapped_column(String)  # cutting, sewing, finishing, packing
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class InlineQC(Base):
    """Межоперационный контроль (Inline QC)."""
    __tablename__ = "inline_qc"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    operation_id: Mapped[int] = mapped_column(Integer, ForeignKey("operation_breakdowns.id"), index=True)
    sample_size: Mapped[int] = mapped_column(Integer)
    defects_found: Mapped[int] = mapped_column(Integer, default=0)
    result: Mapped[str] = mapped_column(String)  # pass, fail, rework
    inspector_id: Mapped[str] = mapped_column(String)
    photo_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class DefectRouting(Base):
    """Разбраковка: куда идёт брак (ремонт / утилизация / повторный раскрой)."""
    __tablename__ = "defect_routing"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    defect_type: Mapped[str] = mapped_column(String)
    qty: Mapped[int] = mapped_column(Integer)
    routing: Mapped[str] = mapped_column(String)  # repair, scrap, recut
    operator_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ReworkRecord(Base):
    """Переработка — повторный пошив после ремонта."""
    __tablename__ = "rework_records"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    defect_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    units_reworked: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="in_progress")  # in_progress, completed
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BatchSourcingType(Base):
    """CMT / давальческая схема vs FOB."""
    __tablename__ = "batch_sourcing_types"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    sourcing_type: Mapped[str] = mapped_column(String)  # cmt, fob, cut_make_trim
    materials_provided_by: Mapped[str] = mapped_column(String)  # brand, factory
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


# --- Assortment & Planning (4. Ассортимент) ---
class GradingSpec(Base):
    """Градация лекал: размерная сетка, размерные шкалы, припуски."""
    __tablename__ = "grading_specs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    size_grid_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    size_increments_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    seam_allowance_mm: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialVariant(Base):
    """Варианты материалов — альтернативные ткани для одного SKU."""
    __tablename__ = "material_variants"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    variant_type: Mapped[str] = mapped_column(String)  # primary, alternative
    priority: Mapped[int] = mapped_column(Integer, default=1)
    color_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class PreProductionMeeting(Base):
    """Pre-production meeting (PPM) — фиксация договорённостей до массового запуска."""
    __tablename__ = "pre_production_meetings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    meeting_date: Mapped[datetime] = mapped_column(DateTime)
    attendees_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    decisions_json: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String, default="scheduled")  # scheduled, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SizeRunPlan(Base):
    """Size run — плановое соотношение по размерам (размерная кривая)."""
    __tablename__ = "size_run_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    collection_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    size_breakdown_json: Mapped[dict] = mapped_column(JSON)  # {"XS": 5, "S": 15, "M": 30, ...}
    total_qty: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ColorStockPlan(Base):
    """Второй цвет в коллекции — закупка/остатки/план по каждому цвету отдельно."""
    __tablename__ = "color_stock_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    color_id: Mapped[int] = mapped_column(Integer, index=True)
    color_name: Mapped[str] = mapped_column(String)
    planned_qty: Mapped[int] = mapped_column(Integer)
    ordered_qty: Mapped[int] = mapped_column(Integer, default=0)
    received_qty: Mapped[int] = mapped_column(Integer, default=0)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


# --- Suppliers & Factories (5. Поставщики и фабрики) ---
class SupplierAudit(Base):
    """Аудит поставщиков — чеклисты, статус, периодичность."""
    __tablename__ = "supplier_audits"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    audit_date: Mapped[datetime] = mapped_column(DateTime)
    audit_type: Mapped[str] = mapped_column(String)  # initial, periodic, for_cause
    checklist_json: Mapped[dict] = mapped_column(JSON, default=dict)
    result: Mapped[str] = mapped_column(String)  # pass, fail, conditional
    responsible_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    next_audit_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialSafetyStock(Base):
    """Страховой запас по материалам с долгим lead time."""
    __tablename__ = "material_safety_stocks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    safety_days: Mapped[int] = mapped_column(Integer)  # days of supply
    min_qty: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String, default="m")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class FactoryFallback(Base):
    """Резервные фабрики — fallback при перегрузке."""
    __tablename__ = "factory_fallbacks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    primary_factory_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    fallback_factory_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class GoodsReceiptNote(Base):
    """GRN — приёмка материалов, сравнение с PO, отклонения."""
    __tablename__ = "goods_receipt_notes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_order_id: Mapped[int] = mapped_column(Integer, index=True)
    received_qty: Mapped[float] = mapped_column(Float)
    ordered_qty: Mapped[float] = mapped_column(Float)
    variance: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String)  # accepted, short, over, damage
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    received_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    received_by: Mapped[str] = mapped_column(String)

class LabDipRetest(Base):
    """Retest / перепроверка — повторный Lab Dip, переотбор образцов."""
    __tablename__ = "lab_dip_retests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    original_lab_dip_id: Mapped[int] = mapped_column(Integer, index=True)
    retest_reason: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="pending")
    result: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class FactoryLoadPlan(Base):
    """Планирование загрузки фабрик — распределение PO по мощностям."""
    __tablename__ = "factory_load_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    factory_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), index=True)
    month: Mapped[int] = mapped_column(Integer)
    year: Mapped[int] = mapped_column(Integer)
    capacity_hours: Mapped[float] = mapped_column(Float)
    allocated_hours: Mapped[float] = mapped_column(Float, default=0.0)
    batch_allocations_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


# --- Quality Control (6. Контроль качества) ---
class DefectTypeRegistry(Base):
    """Реестр типов дефектов — типы, категории, связь с операцией."""
    __tablename__ = "defect_type_registry"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    name_ru: Mapped[str] = mapped_column(String)
    name_en: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    category: Mapped[str] = mapped_column(String)  # minor, major, critical
    operation_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CAPAAction(Base):
    """Корректирующие действия (CAPA) при рецидивах дефектов."""
    __tablename__ = "capa_actions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    defect_type_code: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    operator_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    action_type: Mapped[str] = mapped_column(String)  # training, process_change, tool_replacement
    description: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="open")  # open, in_progress, closed
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class OperatorDefectStats(Base):
    """Статистика по швеям/бригадам — повторяющиеся ошибки."""
    __tablename__ = "operator_defect_stats"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    operator_id: Mapped[str] = mapped_column(String, index=True)
    team_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    defect_type_code: Mapped[str] = mapped_column(String, index=True)
    period_start: Mapped[datetime] = mapped_column(DateTime)
    period_end: Mapped[datetime] = mapped_column(DateTime)
    defect_count: Mapped[int] = mapped_column(Integer, default=0)
    units_produced: Mapped[int] = mapped_column(Integer, default=0)
    defect_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


# --- Additional (7. Дополнительно) ---
class PPSSample(Base):
    """Pre-shipment sample (PPS) — статус и привязка к этапу."""
    __tablename__ = "pps_samples"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    stage: Mapped[str] = mapped_column(String)  # requested, received, approved, rejected
    requested_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    received_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class WearTest(Base):
    """Wear test — протоколы, сроки, статус."""
    __tablename__ = "wear_tests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("production_batches.id"), nullable=True)
    start_date: Mapped[datetime] = mapped_column(DateTime)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="scheduled")  # scheduled, in_progress, completed
    result: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # pass, fail
    protocol_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BatchTraceability(Base):
    """Трассировка партий — от рулона/партии до конкретной единицы продукции."""
    __tablename__ = "batch_traceability"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    production_batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("production_batches.id"), index=True)
    material_lot_id: Mapped[int] = mapped_column(Integer, index=True)
    fabric_roll_id: Mapped[Optional[int]] = mapped_column(Integer, index=True, nullable=True)
    unit_serial: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)  # штрихкод единицы
    trace_chain_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
