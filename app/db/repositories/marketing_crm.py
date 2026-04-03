from typing import List, Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import Influencer, CampaignROI, InfluencerCampaign, SEOCopy, InfluencerItemTrack, PRSampleReturn, User

class MarketingCRMRepository(BaseRepository[Influencer]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Influencer, session, current_user)

    async def get_by_handle(self, handle: str) -> Optional[Influencer]:
        query = select(self.model).where(self.model.handle == handle)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class ROIRepository(BaseRepository[CampaignROI]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CampaignROI, session, current_user)

    async def get_by_campaign(self, campaign_id: str) -> List[CampaignROI]:
        query = select(self.model).where(self.model.campaign_id == campaign_id)
        if self.current_user and self.current_user.role != "platform_admin":
            # Assuming campaign is linked to organization
            pass
        result = await self.session.execute(query)
        return list(result.scalars().all())

class InfluencerCampaignRepository(BaseRepository[InfluencerCampaign]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(InfluencerCampaign, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[InfluencerCampaign]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SEOCopyRepository(BaseRepository[SEOCopy]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SEOCopy, session, current_user)

class InfluencerItemRepository(BaseRepository[InfluencerItemTrack]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(InfluencerItemTrack, session, current_user)

class PRSampleRepository(BaseRepository[PRSampleReturn]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(PRSampleReturn, session, current_user)
