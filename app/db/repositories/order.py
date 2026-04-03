from typing import List, Optional, Any
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import Order, User

class OrderRepository(BaseRepository[Order]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Order, session, current_user)

    async def get(self, id: Any) -> Optional[Order]:
        query = select(Order).where(Order.id == id)
        query = self._apply_role_filter(query)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def update(self, id: Any, **kwargs) -> Optional[Order]:
        stmt = update(Order).where(Order.id == id).values(**kwargs)
        stmt = self._apply_role_filter(stmt)
        result = await self.session.execute(stmt)
        await self.session.commit()
        if result.rowcount == 0:
            return None
        return await self.get(id)

    def _apply_role_filter(self, query):
        if not self.current_user or self.current_user.role == "platform_admin":
            return query
            
        if self.current_user.role in ["brand_admin", "brand_manager", "sales_rep"]:
            return query.where(self.model.organization_id == self.current_user.organization_id)
        elif self.current_user.role in ["buyer_admin", "buyer"]:
            return query.where(self.model.buyer_id == self.current_user.organization_id)
        return query

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Order]:
        query = select(self.model).offset(skip).limit(limit)
        query = self._apply_role_filter(query)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def count(self) -> int:
        query = select(func.count(self.model.id))
        query = self._apply_role_filter(query)
        result = await self.session.execute(query)
        return result.scalar() or 0

    async def get_total_sales_amount(self) -> float:
        """Calculate total sales amount for the current organization."""
        if not self.current_user:
            return 0.0
        query = select(func.sum(self.model.total_amount))
        query = self._apply_role_filter(query)
        result = await self.session.execute(query)
        return result.scalar() or 0.0

    async def count_by_status(self, status: str) -> int:
        """Count orders by status (draft, pending, confirmed, shipped, delivered)."""
        if not self.current_user:
            return 0
        query = select(func.count(self.model.id)).where(self.model.status == status)
        query = self._apply_role_filter(query)
        result = await self.session.execute(query)
        return result.scalar() or 0

    async def count_by_organization(self, org_id: str) -> int:
        """Count orders for organization (brand)."""
        query = select(func.count(self.model.id)).where(self.model.organization_id == org_id)
        result = await self.session.execute(query)
        return result.scalar() or 0
