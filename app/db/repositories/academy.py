from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import AcademyModule, AcademyTest, TestResult, StaffLeaderboard

class AcademyRepository(BaseRepository[AcademyModule]):
    def __init__(self, session: AsyncSession):
        super().__init__(AcademyModule, session)

    async def get_by_brand(self, brand_id: str) -> List[AcademyModule]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_category(self, category: str) -> List[AcademyModule]:
        query = select(self.model).where(self.model.category == category)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class TestRepository(BaseRepository[AcademyTest]):
    def __init__(self, session: AsyncSession):
        super().__init__(AcademyTest, session)

    async def get_by_module(self, module_id: int) -> Optional[AcademyTest]:
        query = select(self.model).where(self.model.module_id == module_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class TestResultRepository(BaseRepository[TestResult]):
    def __init__(self, session: AsyncSession):
        super().__init__(TestResult, session)

    async def get_by_staff(self, staff_id: str) -> List[TestResult]:
        query = select(self.model).where(self.model.staff_id == staff_id).order_by(self.model.completed_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class LeaderboardRepository(BaseRepository[StaffLeaderboard]):
    def __init__(self, session: AsyncSession):
        super().__init__(StaffLeaderboard, session)

    async def get_brand_ranking(self, brand_id: str) -> List[StaffLeaderboard]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.points.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_staff_stats(self, staff_id: str) -> Optional[StaffLeaderboard]:
        query = select(self.model).where(self.model.staff_id == staff_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
