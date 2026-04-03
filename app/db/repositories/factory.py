from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    MachineTelemetry, ProductionMilestone, ProductionSchedule, 
    PredictiveCapacity, QCChecklist, ESGMetric, NeedleCounter, 
    ChemicalAudit, AISourcingMatch, Supplier, MaterialOrder, 
    LabDip, SampleOrder, MachineMaintenance, ProductionBatch, User
)

class FactoryRepository(BaseRepository[MachineTelemetry]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MachineTelemetry, session, current_user=current_user)

    async def get_by_machine(self, machine_id: str, limit: int = 50) -> List[MachineTelemetry]:
        query = select(self.model).where(self.model.machine_id == machine_id).order_by(self.model.timestamp.desc()).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_latest_status(self) -> List[MachineTelemetry]:
        query = select(self.model).order_by(self.model.timestamp.desc())
        result = await self.session.execute(query)
        all_logs = result.scalars().all()
        seen = set()
        latest = []
        for log in all_logs:
            if log.machine_id not in seen:
                latest.append(log)
                seen.add(log.machine_id)
        return latest

class ProductionScheduleRepository(BaseRepository[ProductionSchedule]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ProductionSchedule, session, current_user=current_user)

    async def get_by_order(self, order_id: str) -> Optional[ProductionSchedule]:
        query = select(self.model).where(self.model.order_id == order_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class MilestoneRepository(BaseRepository[ProductionMilestone]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ProductionMilestone, session, current_user=current_user)

    async def get_by_order(self, order_id: str) -> List[ProductionMilestone]:
        query = select(self.model).where(self.model.order_id == order_id).order_by(self.model.target_date.asc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class PredictiveCapacityRepository(BaseRepository[PredictiveCapacity]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(PredictiveCapacity, session, current_user=current_user)

    async def get_by_factory(self, factory_id: str) -> Optional[PredictiveCapacity]:
        query = select(self.model).where(self.model.factory_id == factory_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class QCRepository(BaseRepository[QCChecklist]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(QCChecklist, session, current_user=current_user)

    async def get_by_order(self, order_id: str) -> List[QCChecklist]:
        query = select(self.model).where(self.model.order_id == order_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ESGRepository(BaseRepository[ESGMetric]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ESGMetric, session, current_user=current_user)

    async def get_by_factory(self, factory_id: str) -> List[ESGMetric]:
        query = select(self.model).where(self.model.factory_id == factory_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class NeedleRepository(BaseRepository[NeedleCounter]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(NeedleCounter, session, current_user=current_user)

    async def get_by_machine(self, machine_id: str) -> Optional[NeedleCounter]:
        query = select(self.model).where(self.model.machine_id == machine_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class ChemicalRepository(BaseRepository[ChemicalAudit]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ChemicalAudit, session, current_user=current_user)

    async def get_by_factory(self, factory_id: str) -> List[ChemicalAudit]:
        query = select(self.model).where(self.model.factory_id == factory_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SourcingRepository(BaseRepository[AISourcingMatch]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AISourcingMatch, session, current_user=current_user)

    async def get_by_brand(self, brand_id: str) -> List[AISourcingMatch]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.match_score.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SupplierRepository(BaseRepository[Supplier]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Supplier, session, current_user=current_user)

class MaterialOrderRepository(BaseRepository[MaterialOrder]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MaterialOrder, session, current_user=current_user)

class LabDipRepository(BaseRepository[LabDip]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(LabDip, session, current_user=current_user)

class SampleOrderRepository(BaseRepository[SampleOrder]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SampleOrder, session, current_user=current_user)

class MaintenanceRepository(BaseRepository[MachineMaintenance]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MachineMaintenance, session, current_user=current_user)

class BatchRepository(BaseRepository[ProductionBatch]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ProductionBatch, session, current_user=current_user)
