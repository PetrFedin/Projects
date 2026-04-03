from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import MarketExpansion, ComplianceRequirement

class ExpansionRepository(BaseRepository[MarketExpansion]):
    def __init__(self, session: AsyncSession):
        super().__init__(MarketExpansion, session)

    async def get_by_country(self, country_code: str) -> Optional[MarketExpansion]:
        query = select(self.model).where(self.model.country_code == country_code)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class ComplianceRepository(BaseRepository[ComplianceRequirement]):
    def __init__(self, session: AsyncSession):
        super().__init__(ComplianceRequirement, session)

    async def get_by_country(self, country_code: str) -> List[ComplianceRequirement]:
        query = select(self.model).where(self.model.country_code == country_code)
        result = await self.session.execute(query)
        return list(result.scalars().all())
