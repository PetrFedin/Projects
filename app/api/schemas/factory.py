from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class MachineTelemetryBase(BaseModel):
    machine_id: str
    status: str
    oee: float = 0.0
    power_consumption: float = 0.0
    speed_rpm: int = 0
    operator_id: Optional[str] = None
    metadata_json: Optional[Dict] = None

class TelemetryCreate(MachineTelemetryBase):
    pass

class MachineTelemetry(MachineTelemetryBase):
    id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

class MachineStatusReport(BaseModel):
    machine_id: str
    current_status: str
    last_update: datetime
    avg_oee_24h: float

class MilestoneBase(BaseModel):
    order_id: str
    milestone_name: str
    target_date: datetime
    status: str = "pending"

class MilestoneCreate(MilestoneBase):
    pass

class Milestone(MilestoneBase):
    id: int
    actual_date: Optional[datetime] = None

    model_config = {"from_attributes": True}

class ProductionScheduleBase(BaseModel):
    order_id: str
    gantt_data_json: Dict
    capacity_usage_percent: float = 0.0

class ProductionScheduleCreate(ProductionScheduleBase):
    pass

class ProductionSchedule(ProductionScheduleBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class PredictiveCapacityBase(BaseModel):
    factory_id: str
    historical_avg_delay_days: float = 0.0
    defect_rate_percent: float = 0.0
    current_backlog_hours: int = 0
    predicted_availability_date: datetime
    ai_confidence_score: float = 0.0

class PredictiveCapacityCreate(PredictiveCapacityBase):
    pass

class PredictiveCapacity(PredictiveCapacityBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class QCChecklistBase(BaseModel):
    order_id: str
    checklist_json: Dict
    inspector_id: str
    overall_status: str = "pending"
    defect_report_url: Optional[str] = None

class QCChecklistCreate(QCChecklistBase):
    pass

class QCChecklist(QCChecklistBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class ESGMetricBase(BaseModel):
    factory_id: str
    waste_percentage: float = 0.0
    energy_consumption_kwh: float = 0.0
    water_usage_liters: float = 0.0
    carbon_footprint_kg: float = 0.0
    period_month: int
    period_year: int

class ESGMetricCreate(ESGMetricBase):
    pass

class ESGMetric(ESGMetricBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class NeedleCounterBase(BaseModel):
    machine_id: str
    cycle_count: int = 0
    last_replaced_at: datetime

class NeedleCounterCreate(NeedleCounterBase):
    pass

class NeedleCounter(NeedleCounterBase):
    id: int
    model_config = {"from_attributes": True}

class ChemicalAuditBase(BaseModel):
    factory_id: str
    chemical_name: str
    reach_compliant: bool = True
    oeko_tex_certified: bool = True
    last_audit_date: datetime

class ChemicalAuditCreate(ChemicalAuditBase):
    pass

class ChemicalAudit(ChemicalAuditBase):
    id: int
    model_config = {"from_attributes": True}

class SourcingBase(BaseModel):
    brand_id: str
    sku_category: str
    factory_id: str
    match_score: float
    reasoning_json: Dict
    status: str = "suggested"

class SourcingCreate(SourcingBase):
    pass

class AISourcingMatch(SourcingBase):
    id: int
    model_config = {"from_attributes": True}

class BatchCreate(BaseModel):
    factory_id: str
    order_id: str
    sku_id: str
    planned_qty: int
    status: str = "pending"

class MaintenanceCreate(BaseModel):
    machine_id: str
    last_service_date: datetime
    next_service_date: datetime
    technician_id: str
    cost: float = 0.0
