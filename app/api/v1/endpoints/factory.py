from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.session import get_db
from app.services.factory_service import FactoryService
from app.api.schemas.factory import (
    MachineTelemetry, TelemetryCreate, MachineStatusReport,
    Milestone, MilestoneCreate,
    ProductionSchedule, ProductionScheduleCreate,
    PredictiveCapacity, PredictiveCapacityCreate,
    QCChecklist, QCChecklistCreate,
    ESGMetric, ESGMetricCreate,
    NeedleCounter, NeedleCounterCreate,
    ChemicalAudit, ChemicalAuditCreate,
    AISourcingMatch, SourcingCreate,
    BatchCreate, MaintenanceCreate
)
from app.api.schemas.base import GenericResponse
from app.db.models.base import User

router = APIRouter()

@router.get("/machines", response_model=List[MachineTelemetry])
async def get_all_latest_telemetry(
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_latest_telemetry()
    return items[:limit]

@router.post("/telemetry", response_model=MachineTelemetry)
async def submit_telemetry(
    tele_in: TelemetryCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.submit_telemetry(tele_in)

@router.get("/machines/{machine_id}/history", response_model=List[MachineTelemetry])
async def get_machine_history(
    machine_id: str,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_machine_history(machine_id)
    return items[:limit]

@router.get("/machines/{machine_id}/report", response_model=MachineStatusReport)
async def get_machine_report(
    machine_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    report = await service.get_machine_status_report(machine_id)
    if not report:
        raise HTTPException(status_code=404, detail="Machine not found")
    return report

@router.get("/orders/{order_id}/milestones", response_model=List[Milestone])
async def get_order_milestones(
    order_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_milestones(order_id)
    return items[:limit]

@router.post("/milestones", response_model=Milestone)
async def create_milestone(
    milestone_in: MilestoneCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.create_milestone(milestone_in)

@router.get("/schedules/{order_id}", response_model=Optional[ProductionSchedule])
async def get_production_schedule(
    order_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.get_schedule(order_id)

@router.post("/schedules", response_model=ProductionSchedule)
async def create_production_schedule(
    schedule_in: ProductionScheduleCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.create_schedule(schedule_in)

@router.get("/qc/{order_id}", response_model=List[QCChecklist])
async def get_qc_results(
    order_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_qc_results(order_id)
    return items[:limit]

@router.post("/qc", response_model=QCChecklist)
async def create_qc_check(
    qc_in: QCChecklistCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.create_qc_check(qc_in)

@router.get("/esg/{factory_id}", response_model=List[ESGMetric])
async def get_esg_metrics(
    factory_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_esg_metrics(factory_id)
    return items[:limit]

@router.post("/esg", response_model=ESGMetric)
async def create_esg_metric(
    esg_in: ESGMetricCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.report_esg_metric(esg_in)

@router.post("/needles", response_model=NeedleCounter)
async def submit_needle_count(
    needle_in: NeedleCounterCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.submit_needle_count(needle_in)

@router.post("/chemicals", response_model=ChemicalAudit)
async def report_chemical_audit(
    audit_in: ChemicalAuditCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.report_chemical_audit(audit_in)

@router.get("/sourcing/{brand_id}", response_model=List[AISourcingMatch])
async def get_sourcing_suggestions(
    brand_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    items = await service.get_sourcing_suggestions(brand_id)
    return items[:limit]

@router.post("/sourcing", response_model=AISourcingMatch)
async def suggest_factory(
    sourcing_in: SourcingCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    return await service.suggest_factory(sourcing_in)

@router.post("/batches", response_model=GenericResponse[Dict[str, Any]])
async def create_batch(
    batch_in: BatchCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    batch = await service.create_batch(batch_in)
    return GenericResponse(data={"id": batch.id, "status": "started"})

@router.post("/maintenance", response_model=GenericResponse[Dict[str, Any]])
async def report_maintenance(
    maint_in: MaintenanceCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FactoryService(db, current_user)
    maint = await service.report_maintenance(maint_in)
    return GenericResponse(data={"id": maint.id, "status": "logged"})
