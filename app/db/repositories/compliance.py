from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import HSCodeClassification, DesignCopyright

class ComplianceRepository(BaseRepository[HSCodeClassification]):
    def __init__(self, session: AsyncSession):
        super().__init__(HSCodeClassification, session)

    async def get_by_sku(self, sku_id: str) -> Optional[HSCodeClassification]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class CopyrightRepository(BaseRepository[DesignCopyright]):
    def __init__(self, session: AsyncSession):
        super().__init__(DesignCopyright, session)

    async def get_by_design(self, design_id: str) -> Optional[DesignCopyright]:
        query = select(self.model).where(self.model.design_id == design_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_brand(self, brand_id: str) -> List[DesignCopyright]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
