from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class TechPackVersionBase(BaseModel):
    sku_id: str
    version_number: str
    data_json: Dict[str, Any]
    change_log: str
    created_by: str

class TechPackVersion(TechPackVersionBase):
    id: int
    created_at: datetime
    is_approved: bool
    approved_by: Optional[str] = None
    model_config = {"from_attributes": True}

class ProductDimensionBase(BaseModel):
    sku_id: str
    unit_weight_g: float = 0.0
    folded_width_cm: float = 0.0
    folded_length_cm: float = 0.0
    folded_height_cm: float = 0.0
    box_capacity_units: int = 1
    hs_code: Optional[str] = None

class ProductDimension(ProductDimensionBase):
    id: int
    model_config = {"from_attributes": True}

class FabricRollBase(BaseModel):
    material_id: str
    roll_number: str
    initial_length_m: float
    current_length_m: float
    width_cm: float
    factory_id: str

class FabricRoll(FabricRollBase):
    id: int
    received_at: datetime
    model_config = {"from_attributes": True}

class MarkingCodeBase(BaseModel):
    sku_id: str
    batch_id: Optional[str] = None
    gtin: str
    serial_number: str
    status: str = "ordered"

class MarkingCode(MarkingCodeBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class SMVBase(BaseModel):
    sku_id: str
    operation_name: str
    minutes: float
    labor_rate_per_min: float
    currency: str = "RUB"

class SMV(SMVBase):
    id: int
    model_config = {"from_attributes": True}

class BOMItem(BaseModel):
    item: str
    qty: float
    unit: str
    cost: float

class BOMCreate(BaseModel):
    sku_id: str
    items: List[BOMItem]

class DocumentUpload(BaseModel):
    sku_id: str
    doc_type: str
    title: str
    url: str

class CostingUpdate(BaseModel):
    sku_id: str
    fabric_cost: float
    trim_cost: float
    labor_cost: float
    logistics_cost: float
    target_retail_price: float

class BatchCreate(BaseModel):
    factory_id: str
    order_id: str
    sku_id: str
    planned_qty: int

class MaintenanceCreate(BaseModel):
    machine_id: str
    last_service_date: datetime
    next_service_date: datetime
    technician_id: str
    parts_replaced_json: Optional[Dict] = None
    cost: float = 0.0

class OperationProgressUpdate(BaseModel):
    batch_id: int
    operation_name: str
    units_completed: int
    units_defective: int = 0
    operator_id: Optional[str] = None
    machine_id: Optional[str] = None

class SignOffRequest(BaseModel):
    sku_id: str
    batch_id: Optional[str] = None
    stage: str
    requested_by: str
    artifact_url: Optional[str] = None

class SignOffExecution(BaseModel):
    status: str # approved, rejected, revision_needed
    comments: Optional[str] = None
    approved_by: str

class DetailedQCUpdate(BaseModel):
    batch_id: int
    inspection_type: str
    sample_size: int
    defects_json: Dict[str, int]
    result: str
    inspector_id: str

class MaterialMasterCreate(BaseModel):
    organization_id: str
    name: str
    composition: str
    weight_gsm: Optional[float] = None
    width_cm: Optional[float] = None
    unit: str = "m"
    default_price: float = 0.0
    currency: str = "RUB"

class RFQCreate(BaseModel):
    organization_id: str
    title: str
    deadline: datetime
    notes: Optional[str] = None
    items: List[Dict[str, Any]] # List of material details

class SupplierOfferSubmit(BaseModel):
    rfq_id: int
    supplier_id: int
    total_price: float
    currency: str = "RUB"
    lead_time_days: int
    valid_until: datetime

class ComplianceCertCreate(BaseModel):
    organization_id: str
    supplier_id: Optional[int] = None
    material_id: Optional[str] = None
    cert_type: str
    cert_number: str
    valid_from: datetime
    valid_until: datetime
    document_url: Optional[str] = None

class PaymentMilestoneCreate(BaseModel):
    batch_id: Optional[int] = None
    material_order_id: Optional[int] = None
    milestone_name: str
    percentage: float
    amount: float
    currency: str = "RUB"
    due_date: datetime
    linked_production_milestone_id: Optional[int] = None

class ScorecardResponse(BaseModel):
    supplier_id: int
    period_start: datetime
    period_end: datetime
    avg_delay_days: float
    defect_rate_percent: float
    compliance_score: float
    financial_reliability: float
    overall_score: float
    total_orders_analyzed: int
    model_config = {"from_attributes": True}

class MaterialPlanningResponse(BaseModel):
    id: int
    batch_id: int
    material_id: str
    required_qty: float
    reserved_qty: float
    unit: str
    shortage_qty: float
    status: str
    model_config = {"from_attributes": True}

class GradingChartUpdate(BaseModel):
    sku_id: str
    base_size: str
    measurements_per_size: Dict[str, Dict[str, float]]
    increments: Optional[Dict[str, float]] = None

class BatchCreateDetailed(BaseModel):
    factory_id: str
    order_id: str
    sku_id: str
    planned_qty: int
    size_breakdown: Dict[str, int]

class ColorLibraryCreate(BaseModel):
    organization_id: str
    name: str
    pantone_code: Optional[str] = None
    hex_code: Optional[str] = None

class SizeGridCreate(BaseModel):
    name: str
    region: str
    sizes: List[str]

class ContractUsageResponse(BaseModel):
    contract_number: str
    usage_percent: float
    volume_remaining: float
    status: str

class AQLCalculationResponse(BaseModel):
    sample_size: int
    accept_limit: int
    reject_limit: int
    aql_level: float
    note: Optional[str] = None

class StageAssignment(BaseModel):
    staff_id: Optional[str] = None
    staff_name: Optional[str] = None # Manual entry
    partner_id: Optional[int] = None

class StageUpdate(BaseModel):
    readiness_percent: float
    comment: Optional[str] = None
    has_questions: bool = False

class ProductionStageResponse(BaseModel):
    id: int
    name: str
    order: int
    status: str
    progress: float
    assigned_to: Optional[str]
    dates: Dict[str, str]
    flags: Dict[str, bool]
    last_note: Optional[str] = None
