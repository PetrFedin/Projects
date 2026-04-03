from typing import List, Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    TechPackVersion, ProductDimension, PackagingSpecification,
    StandardMinuteValue, QualityDefectMap, SubcontractorMovement,
    ProductionBatch, FabricRoll, RawMaterialTransaction, TollMaterialBalance,
    User
)

class TechPackRepository(BaseRepository[TechPackVersion]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(TechPackVersion, session, current_user=current_user)

    async def get_latest_version(self, sku_id: str) -> Optional[TechPackVersion]:
        stmt = select(TechPackVersion).filter_by(sku_id=sku_id).order_by(TechPackVersion.version_number.desc()).limit(1)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_versions_count(self, sku_id: str) -> int:
        stmt = select(TechPackVersion).filter_by(sku_id=sku_id)
        result = await self.session.execute(stmt)
        return len(result.all())

class ProductionExecutionRepository(BaseRepository[ProductionBatch]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ProductionBatch, session, current_user=current_user)

class InventoryRepository(BaseRepository[FabricRoll]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FabricRoll, session, current_user=current_user)

    async def get_factory_balance(self, factory_id: str) -> List[FabricRoll]:
        stmt = select(FabricRoll).filter_by(factory_id=factory_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()
