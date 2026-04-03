from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import WardrobeItem, WishlistGroup, ReferralProgram, BoxSubscription

class WardrobeRepository(BaseRepository[WardrobeItem]):
    def __init__(self, session: AsyncSession):
        super().__init__(WardrobeItem, session)

    async def get_by_customer(self, customer_id: str) -> List[WardrobeItem]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_condition(self, customer_id: str, condition: str) -> List[WardrobeItem]:
        query = select(self.model).where(
            (self.model.customer_id == customer_id) & (self.model.condition == condition)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

class WishlistRepository(BaseRepository[WishlistGroup]):
    def __init__(self, session: AsyncSession):
        super().__init__(WishlistGroup, session)

    async def get_by_user(self, user_id: str) -> List[WishlistGroup]:
        query = select(self.model).where(self.model.user_id == user_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ReferralRepository(BaseRepository[ReferralProgram]):
    def __init__(self, session: AsyncSession):
        super().__init__(ReferralProgram, session)

    async def get_by_referrer(self, referrer_id: str) -> List[ReferralProgram]:
        query = select(self.model).where(self.model.referrer_id == referrer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_referred(self, referred_id: str) -> Optional[ReferralProgram]:
        query = select(self.model).where(self.model.referred_id == referred_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class SubscriptionRepository(BaseRepository[BoxSubscription]):
    def __init__(self, session: AsyncSession):
        super().__init__(BoxSubscription, session)

    async def get_by_customer(self, customer_id: str) -> List[BoxSubscription]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
