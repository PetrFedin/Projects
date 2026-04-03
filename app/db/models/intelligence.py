import enum
from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class TaskStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    BLOCKED = "blocked"
    FAILED = "failed"

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    task_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    module: Mapped[str] = mapped_column(String)
    task_type: Mapped[str] = mapped_column(String)
    purpose: Mapped[str] = mapped_column(String)
    status: Mapped[TaskStatus] = mapped_column(SQLEnum(TaskStatus), default=TaskStatus.TODO)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    depends_on: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    files: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class AgentState(Base):
    __tablename__ = "agent_states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    agent_name: Mapped[str] = mapped_column(String, unique=True, index=True)
    current_task: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    last_completed_task: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    memory_summary: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class FeatureProposal(Base):
    __tablename__ = "feature_proposals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String, index=True)
    category: Mapped[str] = mapped_column(String)
    problem: Mapped[str] = mapped_column(String)
    proposed_solution: Mapped[str] = mapped_column(String)
    business_value: Mapped[str] = mapped_column(String)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, reviewed, approved, rejected
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CompetitorSignal(Base):
    __tablename__ = "competitor_signals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    competitor_name: Mapped[str] = mapped_column(String, index=True)
    feature_name: Mapped[str] = mapped_column(String)
    signal_type: Mapped[str] = mapped_column(String) # feature, pricing, strategy
    description: Mapped[str] = mapped_column(String)
    url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    priority: Mapped[int] = mapped_column(Integer, default=1)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class GlobalLogisticsRisk(Base):
    __tablename__ = "global_logistics_risks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    region: Mapped[str] = mapped_column(String, index=True)
    risk_level: Mapped[str] = mapped_column(String) # low, medium, high, critical
    description: Mapped[str] = mapped_column(String)
    impact_score: Mapped[float] = mapped_column(default=0.0)
    mitigation_plan: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class SupplyChainBottleneck(Base):
    __tablename__ = "supply_chain_bottlenecks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    location_id: Mapped[str] = mapped_column(String, index=True) # factory, warehouse, port
    severity: Mapped[str] = mapped_column(String) # low, medium, high, critical
    impact_description: Mapped[str] = mapped_column(String)
    delay_days_est: Mapped[int] = mapped_column(default=0)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class MarketExpansion(Base):
    __tablename__ = "market_expansions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    country_code: Mapped[str] = mapped_column(String, unique=True, index=True) # ISO 3166-1 alpha-2
    market_status: Mapped[str] = mapped_column(String, default="research") # research, setup, active, blocked
    avg_import_duty: Mapped[float] = mapped_column(Float, default=0.0)
    local_vat_rate: Mapped[float] = mapped_column(Float, default=0.0)
    logistics_complexity_score: Mapped[int] = mapped_column(Integer, default=1) # 1-10
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ComplianceRequirement(Base):
    __tablename__ = "compliance_requirements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    country_code: Mapped[str] = mapped_column(String, index=True)
    requirement_type: Mapped[str] = mapped_column(String) # labeling, toxicity, tax, certification
    description: Mapped[str] = mapped_column(String)
    is_mandatory: Mapped[bool] = mapped_column(default=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, verified, failed
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class AcademyModule(Base):
    __tablename__ = "academy_modules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True)
    title: Mapped[str] = mapped_column(String)
    content_url: Mapped[str] = mapped_column(String) # Link to video or PDF instructions
    category: Mapped[str] = mapped_column(String) # e.g., "Sales", "Visual Merchandising", "QC"
    is_active: Mapped[bool] = mapped_column(default=True)

class AcademyTest(Base):
    __tablename__ = "academy_tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    module_id: Mapped[int] = mapped_column(Integer, index=True)
    questions_json: Mapped[dict] = mapped_column(JSON)
    passing_score: Mapped[int] = mapped_column(Integer, default=80)

class TestResult(Base):
    __tablename__ = "academy_test_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    staff_id: Mapped[str] = mapped_column(String, index=True)
    test_id: Mapped[int] = mapped_column(Integer, index=True)
    score: Mapped[int] = mapped_column(Integer)
    is_passed: Mapped[bool] = mapped_column(default=False)
    completed_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class AuditTrail(Base):
    __tablename__ = "audit_trails"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entity_type: Mapped[str] = mapped_column(String, index=True) # tech_pack, order, budget
    entity_id: Mapped[str] = mapped_column(String, index=True)
    action: Mapped[str] = mapped_column(String) # create, update, delete, approve
    changes_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    user_id: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class InventorySyncLog(Base):
    __tablename__ = "inventory_sync_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    external_system: Mapped[str] = mapped_column(String) # Shopify, 1C
    sync_type: Mapped[str] = mapped_column(String) # full, delta
    items_synced_count: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String) # success, failed
    error_message: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class DealerKPI(Base):
    __tablename__ = "dealer_kpi"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    dealer_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    historical_accuracy: Mapped[float] = mapped_column(default=0.0) # 0.0 to 1.0
    trust_score: Mapped[float] = mapped_column(default=0.0) # 0 to 100
    regional_demand_index: Mapped[float] = mapped_column(default=1.0)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class QuotaAllocation(Base):
    __tablename__ = "quota_allocations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    dealer_id: Mapped[str] = mapped_column(String, index=True)
    allocated_quantity: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="proposed") # proposed, confirmed, rejected
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class DigitalTwinFeedback(Base):
    __tablename__ = "digital_twin_feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    body_model_id: Mapped[str] = mapped_column(String) # Link to AI Body Scan
    fit_rating: Mapped[int] = mapped_column(Integer) # 1-5
    comfort_score: Mapped[int] = mapped_column(Integer) # 1-5
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    fit_visual_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) # Heatmap or fit points
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ContentGeneration(Base):
    __tablename__ = "content_generations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    content_type: Mapped[str] = mapped_column(String) # description, social_post, ad_copy
    platform: Mapped[str] = mapped_column(String) # instagram, tiktok, shopify, amazon
    generated_text: Mapped[str] = mapped_column(String)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, approved, published
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class DealerExclusivity(Base):
    __tablename__ = "dealer_exclusivity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    region: Mapped[str] = mapped_column(String)
    exclusive_categories_json: Mapped[dict] = mapped_column(JSON) # List of categories

class TradeComplianceLog(Base):
    __tablename__ = "trade_compliance_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True)
    action: Mapped[str] = mapped_column(String) # sanction_check, export_control
    result: Mapped[str] = mapped_column(String) # cleared, flagged, blocked
    details_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class EACCertificate(Base):
    __tablename__ = "eac_certificates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    certificate_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    sku_ids_json: Mapped[dict] = mapped_column(JSON) # SKUs covered by this certificate
    valid_from: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    expiry_date: Mapped[datetime] = mapped_column(DateTime)
    certification_body: Mapped[str] = mapped_column(String)
    file_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="active")

class ChestnyZnakCode(Base):
    __tablename__ = "chestny_znak_codes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    gtin: Mapped[str] = mapped_column(String, index=True)
    serial_number: Mapped[str] = mapped_column(String, unique=True)
    status: Mapped[str] = mapped_column(String, default="emitted") # emitted, applied, sold, withdrawn
    order_id_cz: Mapped[Optional[str]] = mapped_column(String, nullable=True) # ID from Chestny Znak API
    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class EDODocument(Base):
    __tablename__ = "edo_documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    doc_type: Mapped[str] = mapped_column(String) # UPD, UKD, Invoice, transfer_act, processing_report
    doc_number: Mapped[str] = mapped_column(String, index=True)
    external_id: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Diadoc ID
    partner_org_id: Mapped[str] = mapped_column(String, index=True)
    total_amount: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String, default="draft") # draft, sent, signed, rejected
    file_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    signed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class BrandESGMetric(Base):
    __tablename__ = "brand_esg_metrics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    category: Mapped[str] = mapped_column(String) # carbon_footprint, water_usage, recyclability, social_impact
    value: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String) # kg_co2, m3, percentage
    period: Mapped[str] = mapped_column(String) # monthly, quarterly, yearly
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class LoyaltyProgram(Base):
    __tablename__ = "loyalty_programs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    program_name: Mapped[str] = mapped_column(String)
    tier_rules_json: Mapped[dict] = mapped_column(JSON) # { "silver": 1000, "gold": 5000 }
    status: Mapped[str] = mapped_column(String, default="active")

class CustomerLoyalty(Base):
    __tablename__ = "customer_loyalty"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    points: Mapped[int] = mapped_column(Integer, default=0)
    tier: Mapped[str] = mapped_column(String, default="standard")
    last_interaction: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BrandAsset(Base):
    __tablename__ = "brand_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    asset_type: Mapped[str] = mapped_column(String) # logo, lookbook, press_release, video
    title: Mapped[str] = mapped_column(String)
    file_url: Mapped[str] = mapped_column(String)
    is_public: Mapped[bool] = mapped_column(default=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class RegionalPerformance(Base):
    __tablename__ = "regional_performance"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    region: Mapped[str] = mapped_column(String, index=True)
    total_sales: Mapped[float] = mapped_column(Float, default=0.0)
    order_count: Mapped[int] = mapped_column(Integer, default=0)
    top_sku_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    period: Mapped[str] = mapped_column(String) # monthly, seasonal
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String)
    predicted_demand: Mapped[int] = mapped_column(Integer)
    confidence_score: Mapped[float] = mapped_column(Float)
    factors_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SizeCurve(Base):
    __tablename__ = "size_curves"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    region: Mapped[str] = mapped_column(String)
    curve_json: Mapped[dict] = mapped_column(JSON) # {"S": 0.1, "M": 0.4, ...}
    confidence_score: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SupplyChainRisk(Base):
    __tablename__ = "supply_chain_risks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    order_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    risk_type: Mapped[str] = mapped_column(String) # production_delay, logistics_delay, supplier_issue
    severity: Mapped[str] = mapped_column(String) # low, medium, high, critical
    impact_description: Mapped[str] = mapped_column(String)
    estimated_delay_days: Mapped[int] = mapped_column(Integer, default=0)
    mitigation_suggestions_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(String, default="active") # active, mitigated, closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class GlobalTaxReport(Base):
    __tablename__ = "global_tax_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    country_code: Mapped[str] = mapped_column(String, index=True)
    period: Mapped[str] = mapped_column(String) # Q1-2025, Jan-2025
    total_tax_amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="USD")
    tax_breakdown_json: Mapped[dict] = mapped_column(JSON) # {"VAT": 100, "Duty": 50}
    status: Mapped[str] = mapped_column(String, default="draft") # draft, submitted, paid
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class UnifiedAlert(Base):
    __tablename__ = "unified_alerts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    category: Mapped[str] = mapped_column(String) # production, finance, commerce, logistics
    alert_type: Mapped[str] = mapped_column(String) # delay, breach, stock_low, payment_failed
    severity: Mapped[str] = mapped_column(String) # low, medium, high, critical
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    context_type: Mapped[Optional[str]] = mapped_column(String, nullable=True) # order, batch, sku, invoice
    context_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="open") # open, investigating, resolved, dismissed
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class SanctionCheck(Base):
    __tablename__ = "sanction_checks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    target_entity_id: Mapped[str] = mapped_column(String, index=True) # Org ID or User ID checked
    target_name: Mapped[str] = mapped_column(String)
    check_type: Mapped[str] = mapped_column(String) # aml, sanction, kyc
    result: Mapped[str] = mapped_column(String) # cleared, flagged, blocked
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    details_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    performed_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class AgentFeedback(Base):
    """Feedback loop: agent change outcomes for RAG (success/fail, tests, lint)."""
    __tablename__ = "agent_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    task: Mapped[str] = mapped_column(String, index=True)
    task_type: Mapped[str] = mapped_column(String, index=True)  # CODE_ITERATION, BUGFIX_ITERATION
    code_changes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    success: Mapped[bool] = mapped_column(Boolean, default=False)
    test_passed: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    lint_passed: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
