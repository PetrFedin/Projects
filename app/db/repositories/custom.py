from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import CustomOrder

class CustomRepository(BaseRepository[CustomOrder]):
    def __init__(self, session: AsyncSession):
        super().__init__(CustomOrder, session)

    async def get_by_customer(self, customer_id: str) -> List[CustomOrder]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_status(self, status: str) -> List[CustomOrder]:
        query = select(self.model).where(self.model.status == status)
        result = await self.session.execute(query)
        return list(result.scalars().all())
