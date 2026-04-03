from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import DigitalTwinFeedback

class DigitalTwinRepository(BaseRepository[DigitalTwinFeedback]):
    def __init__(self, session: AsyncSession):
        super().__init__(DigitalTwinFeedback, session)

    async def get_by_sku(self, sku_id: str) -> List[DigitalTwinFeedback]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_average_rating(self, sku_id: str) -> float:
        query = select(func.avg(self.model.fit_rating)).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return result.scalar() or 0.0
