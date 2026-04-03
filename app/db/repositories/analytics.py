from typing import List, Optional, Any
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import FootfallMetric, ARNavigationNode, CategorySellThrough, ReturnAnalysis, MerchandiseGrid, CustomerFeedback, User

class AnalyticsRepository(BaseRepository[FootfallMetric]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FootfallMetric, session, current_user)

    async def get_by_store(self, store_id: str) -> List[FootfallMetric]:
        query = select(self.model).where(self.model.store_id == store_id).order_by(self.model.timestamp.desc())
        if self.current_user and self.current_user.role != "platform_admin":
            # Assuming store has organization_id link
            pass
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_zone_metrics(self, store_id: str, zone_id: str) -> List[FootfallMetric]:
        query = select(self.model).where(
            (self.model.store_id == store_id) & (self.model.zone_id == zone_id)
        ).order_by(self.model.timestamp.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ARRepository(BaseRepository[ARNavigationNode]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ARNavigationNode, session, current_user)

class SellThroughRepository(BaseRepository[CategorySellThrough]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CategorySellThrough, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[CategorySellThrough]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ReturnAnalysisRepository(BaseRepository[ReturnAnalysis]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ReturnAnalysis, session, current_user)

class MerchandiseRepository(BaseRepository[MerchandiseGrid]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MerchandiseGrid, session, current_user)

    async def get_by_brand(self, brand_id: str, season: Optional[str] = None) -> List[MerchandiseGrid]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if season:
            query = query.where(self.model.season == season)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class FeedbackRepository(BaseRepository[CustomerFeedback]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CustomerFeedback, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[CustomerFeedback]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.created_at.desc())
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_nps_score(self, brand_id: str) -> float:
        # Simplified NPS calculation: (Promoters - Detractors) / Total * 100
        # Assuming 1-10 scale: Detractors (0-6), Passives (7-8), Promoters (9-10)
        query = select(self.model.rating).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        ratings = result.scalars().all()
        if not ratings: return 0.0
        total = len(ratings)
        promoters = len([r for r in ratings if r >= 9])
        detractors = len([r for r in ratings if r <= 6])
        return ((promoters - detractors) / total) * 100
