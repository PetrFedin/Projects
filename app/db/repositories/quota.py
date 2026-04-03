from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import QuotaAllocation, DealerKPI

class QuotaRepository(BaseRepository[QuotaAllocation]):
    def __init__(self, session: AsyncSession):
        super().__init__(QuotaAllocation, session)

    async def get_by_sku(self, sku_id: str) -> List[QuotaAllocation]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_dealer(self, dealer_id: str) -> List[QuotaAllocation]:
        query = select(self.model).where(self.model.dealer_id == dealer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class DealerKPIRepository(BaseRepository[DealerKPI]):
    def __init__(self, session: AsyncSession):
        super().__init__(DealerKPI, session)

    async def get_by_dealer_id(self, dealer_id: str) -> Optional[DealerKPI]:
        query = select(self.model).where(self.model.dealer_id == dealer_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
