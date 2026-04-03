"""PLM API request models — extracted to reduce routes.py size."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class MaterialOrderCreate(BaseModel):
    supplier_id: int
    material_name: str
    quantity: float
    unit: str
    total_price: float
    currency: str = "RUB"


class LabDipCreate(BaseModel):
    color_name: str
    pantone_code: Optional[str] = None
    comments: Optional[str] = None


class ProductionMessageCreate(BaseModel):
    text: str
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    sku_id: Optional[str] = None
    batch_id: Optional[str] = None
    context_id: Optional[str] = None  # maps to sku_id or entity_id
    recipient_role: Optional[str] = None


class VersionCreate(BaseModel):
    sku_id: str
    data: Dict[str, Any]
    change_log: str


class MarkingOrder(BaseModel):
    sku_id: str
    batch_id: str
    quantity: int


class CloneRequest(BaseModel):
    source_sku_id: str
    new_sku_id: str
    new_collection_id: Optional[str] = None


class ResponsibleAssignment(BaseModel):
    entity_type: str
    entity_id: Any
    user_id: str


class OperationProgressUpdate(BaseModel):
    batch_id: int
    operation: str
    units: int
    defects: int = 0
    operator_id: Optional[str] = None


class SignOffRequest(BaseModel):
    sku_id: str
    stage: str
    artifact_url: Optional[str] = None


class SignOffExecution(BaseModel):
    status: str
    comments: Optional[str] = None


class DetailedQCUpdate(BaseModel):
    batch_id: int
    inspection_type: str
    defects: Dict[str, int]
    result: str


class MaterialMasterCreate(BaseModel):
    name: str
    composition: str
    weight_gsm: Optional[float] = None
    width_cm: Optional[float] = None
    default_price: float = 0.0
    currency: str = "RUB"


class MaterialConsumption(BaseModel):
    batch_id: int
    lot_id: int
    qty: float


class ProductionFinish(BaseModel):
    batch_id: int
    color: str
    size: str
    qty: int
    warehouse_id: str


class AllocationRequest(BaseModel):
    order_id: int
    stock_id: int
    qty: int


class LotReservationRequest(BaseModel):
    planning_id: int
    lot_reservations: List[Dict[str, Any]]


class SizeConvertRequest(BaseModel):
    source_grid_id: int
    target_grid_id: int
    size_label: str


class CuttingMarkerCreate(BaseModel):
    batch_id: int
    sku_id: str
    marker_number: str
    planned_length_m: float
    roll_id: Optional[int] = None
    efficiency_percent: float = 0.0
    selvage_cm: float = 0.0
    waste_m: float = 0.0


class CuttingReportCreate(BaseModel):
    marker_id: int
    batch_id: int
    bom_planned_m: float
    actual_used_m: float


class MaterialAllowanceCreate(BaseModel):
    sku_id: str
    material_id: str
    operation: str
    allowance_percent: float
    unit: str = "m"


class InlineQCCreate(BaseModel):
    batch_id: int
    operation_id: int
    sample_size: int
    defects_found: int = 0
    result: str
    inspector_id: str
    photo_url: Optional[str] = None


class DefectTypeCreate(BaseModel):
    code: str
    name_ru: str
    category: str
    name_en: Optional[str] = None
    operation_code: Optional[str] = None


class GRNCreate(BaseModel):
    material_order_id: int
    received_qty: float
    ordered_qty: float
    status: str
    received_by: str
    notes: Optional[str] = None


class CAPACreate(BaseModel):
    defect_type_code: str
    description: str
    action_type: str
    batch_id: Optional[int] = None
    operator_id: Optional[str] = None
