from typing import List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import StaffReward, ShiftSwapRequest, SalaryAdvance

class StaffRepository(BaseRepository[StaffReward]):
    def __init__(self, session: AsyncSession):
        super().__init__(StaffReward, session)

    async def get_by_staff(self, staff_id: str) -> List[StaffReward]:
        query = select(self.model).where(self.model.staff_id == staff_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_store(self, store_id: str) -> List[StaffReward]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_leaderboard(self, store_id: Optional[str] = None) -> List[dict]:
        query = select(self.model.staff_id, func.sum(self.model.points).label("total_points"))
        if store_id:
            query = query.where(self.model.store_id == store_id)
        query = query.group_by(self.model.staff_id).order_by(func.sum(self.model.points).desc())
        
        result = await self.session.execute(query)
        rows = result.all()
        return [{"staff_id": r.staff_id, "total_points": r.total_points} for r in rows]

class SwapRepository(BaseRepository[ShiftSwapRequest]):
    def __init__(self, session: AsyncSession):
        super().__init__(ShiftSwapRequest, session)

    async def get_pending_for_staff(self, staff_id: str) -> List[ShiftSwapRequest]:
        query = select(self.model).where(self.model.target_staff_id == staff_id, self.model.status == "pending")
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SalaryRepository(BaseRepository[SalaryAdvance]):
    def __init__(self, session: AsyncSession):
        super().__init__(SalaryAdvance, session)

    async def get_by_staff(self, staff_id: str) -> List[SalaryAdvance]:
        query = select(self.model).where(self.model.staff_id == staff_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
