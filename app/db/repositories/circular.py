from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import MaterialLeftover, SubscriptionPlan, RentalOrder, CircularItem

class CircularRepository(BaseRepository[MaterialLeftover]):
    def __init__(self, session: AsyncSession):
        super().__init__(MaterialLeftover, session)

    async def get_by_supplier(self, supplier_id: str) -> List[MaterialLeftover]:
        query = select(self.model).where(self.model.supplier_id == supplier_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_available(self, material_name: Optional[str] = None) -> List[MaterialLeftover]:
        query = select(self.model).where(self.model.status == "available")
        if material_name:
            query = query.where(self.model.material_name.ilike(f"%{material_name}%"))
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SubscriptionRepository(BaseRepository[SubscriptionPlan]):
    def __init__(self, session: AsyncSession):
        super().__init__(SubscriptionPlan, session)

class RentalRepository(BaseRepository[RentalOrder]):
    def __init__(self, session: AsyncSession):
        super().__init__(RentalOrder, session)

    async def get_by_customer(self, customer_id: str) -> List[RentalOrder]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class CircularItemRepository(BaseRepository[CircularItem]):
    def __init__(self, session: AsyncSession):
        super().__init__(CircularItem, session)

    async def get_by_sku(self, sku_id: str) -> List[CircularItem]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
