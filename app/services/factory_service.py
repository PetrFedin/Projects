from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.factory import (
    FactoryRepository, MilestoneRepository,
    ProductionScheduleRepository, PredictiveCapacityRepository,
    QCRepository, ESGRepository, NeedleRepository, ChemicalRepository, SourcingRepository,
    MaintenanceRepository, BatchRepository
)
from app.db.models.base import (
    User, MachineTelemetry, ProductionSchedule, ProductionMilestone,
    PredictiveCapacity, QCChecklist, ESGMetric, NeedleCounter,
    ChemicalAudit, AISourcingMatch, MachineMaintenance, ProductionBatch
)
from app.api.schemas.factory import (
    TelemetryCreate, ProductionScheduleCreate, MilestoneCreate,
    PredictiveCapacityCreate, QCChecklistCreate, ESGMetricCreate,
    NeedleCounterCreate, ChemicalAuditCreate, SourcingCreate,
    BatchCreate, MaintenanceCreate
)
from app.services.ai_rule_engine import AIRuleEngine

class FactoryService:
    """
    Service for managing Factory operations, IoT telemetry, and production workflows.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.factory_repo = FactoryRepository(db, current_user=current_user)
        self.schedule_repo = ProductionScheduleRepository(db, current_user=current_user)
        self.milestone_repo = MilestoneRepository(db, current_user=current_user)
        self.capacity_repo = PredictiveCapacityRepository(db, current_user=current_user)
        self.qc_repo = QCRepository(db, current_user=current_user)
        self.esg_repo = ESGRepository(db, current_user=current_user)
        self.needle_repo = NeedleRepository(db, current_user=current_user)
        self.chemical_repo = ChemicalRepository(db, current_user=current_user)
        self.sourcing_repo = SourcingRepository(db, current_user=current_user)
        self.maintenance_repo = MaintenanceRepository(db, current_user=current_user)
        self.batch_repo = BatchRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- Telemetry & IoT ---
    async def get_latest_telemetry(self) -> List[MachineTelemetry]:
        return await self.factory_repo.get_latest_status()

    async def submit_telemetry(self, data: TelemetryCreate) -> MachineTelemetry:
        new_tele = MachineTelemetry(**data.model_dump())
        return await self.factory_repo.create(new_tele)

    async def get_machine_history(self, machine_id: str) -> List[MachineTelemetry]:
        return await self.factory_repo.get_by_machine(machine_id)

    async def get_machine_status_report(self, machine_id: str) -> Dict[str, Any]:
        history = await self.factory_repo.get_by_machine(machine_id, limit=100)
        if not history:
            return None
        
        avg_oee = sum(h.oee for h in history) / len(history) if history else 0.0
        latest = history[0]
        
        return {
            "machine_id": machine_id,
            "current_status": latest.status,
            "last_update": latest.timestamp,
            "avg_oee_24h": avg_oee
        }

    # --- Production Scheduling ---
    async def get_schedule(self, order_id: str) -> Optional[ProductionSchedule]:
        return await self.schedule_repo.get_by_order(order_id)

    async def create_schedule(self, data: ProductionScheduleCreate) -> ProductionSchedule:
        new_schedule = ProductionSchedule(**data.model_dump())
        return await self.schedule_repo.create(new_schedule)

    async def get_milestones(self, order_id: str) -> List[ProductionMilestone]:
        return await self.milestone_repo.get_by_order(order_id)

    async def create_milestone(self, data: MilestoneCreate) -> ProductionMilestone:
        new_milestone = ProductionMilestone(**data.model_dump())
        return await self.milestone_repo.create(new_milestone)

    # --- Quality & ESG ---
    async def get_qc_results(self, order_id: str) -> List[QCChecklist]:
        return await self.qc_repo.get_by_order(order_id)

    async def create_qc_check(self, data: QCChecklistCreate) -> QCChecklist:
        new_qc = QCChecklist(**data.model_dump())
        return await self.qc_repo.create(new_qc)

    async def get_esg_metrics(self, factory_id: str) -> List[ESGMetric]:
        return await self.esg_repo.get_by_factory(factory_id)

    async def report_esg_metric(self, data: ESGMetricCreate) -> ESGMetric:
        new_esg = ESGMetric(**data.model_dump())
        return await self.esg_repo.create(new_esg)

    # --- Maintenance & Chemicals ---
    async def submit_needle_count(self, data: NeedleCounterCreate) -> NeedleCounter:
        new_needle = NeedleCounter(**data.model_dump())
        return await self.needle_repo.create(new_needle)

    async def report_chemical_audit(self, data: ChemicalAuditCreate) -> ChemicalAudit:
        new_audit = ChemicalAudit(**data.model_dump())
        return await self.chemical_repo.create(new_audit)

    # --- Sourcing ---
    async def get_sourcing_suggestions(self, brand_id: str) -> List[AISourcingMatch]:
        return await self.sourcing_repo.get_by_brand(brand_id)

    async def suggest_factory(self, data: SourcingCreate) -> AISourcingMatch:
        new_match = AISourcingMatch(**data.model_dump())
        return await self.sourcing_repo.create(new_match)

    # --- Batch & Maintenance ---
    async def create_batch(self, data: BatchCreate) -> ProductionBatch:
        new_batch = ProductionBatch(**data.model_dump())
        batch = await self.batch_repo.create(new_batch)
        
        # Horizontal Integration: Notify production planner
        await self.rule_engine.trigger_event("factory.batch_started", {
            "module": "factory",
            "batch_id": batch.id,
            "order_id": batch.order_id,
            "sku_id": batch.sku_id
        })
        return batch

    async def report_maintenance(self, data: MaintenanceCreate) -> MachineMaintenance:
        new_maint = MachineMaintenance(**data.model_dump())
        maint = await self.maintenance_repo.create(new_maint)
        
        # Horizontal Integration: Trigger alert if downtime is expected
        await self.rule_engine.trigger_event("factory.maintenance_logged", {
            "module": "factory",
            "machine_id": maint.machine_id,
            "next_service": maint.next_service_date.isoformat()
        })
        return maint
