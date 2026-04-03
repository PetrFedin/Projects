from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import GlobalLogisticsRisk

class RiskRepository(BaseRepository[GlobalLogisticsRisk]):
    def __init__(self, session: AsyncSession):
        super().__init__(GlobalLogisticsRisk, session)

    async def get_active_risks(self) -> List[GlobalLogisticsRisk]:
        query = select(self.model).where(self.model.is_active == True).order_by(self.model.impact_score.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_region(self, region: str) -> List[GlobalLogisticsRisk]:
        query = select(self.model).where(
            (self.model.region == region) & (self.model.is_active == True)
        ).order_by(self.model.impact_score.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())
