from typing import List, Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import InvestmentCampaign, InvestmentContribution, TransactionSplit, Invoice, FactoringRequest, CargoInsurance, BrandLiquidity, AdvancedCosting, FinanceBudget, User

class InvestmentRepository(BaseRepository[InvestmentCampaign]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(InvestmentCampaign, session, current_user)

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[InvestmentCampaign]:
        """
        Bypass automatic organization filter for campaigns so buyers can see them.
        """
        query = select(self.model).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_brand(self, brand_id: str) -> List[InvestmentCampaign]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_active_campaigns(self) -> List[InvestmentCampaign]:
        query = select(self.model).where(self.model.status == "active")
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ContributionRepository(BaseRepository[InvestmentContribution]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(InvestmentContribution, session, current_user)

    async def get_by_campaign(self, campaign_id: int) -> List[InvestmentContribution]:
        query = select(self.model).where(self.model.campaign_id == campaign_id)
        if self.current_user and self.current_user.role != "platform_admin":
            # Simplified check: in reality, need campaign brand ownership or contribution ownership
            pass 
        result = await self.session.execute(query)
        return list(result.scalars().all())

class TransactionSplitRepository(BaseRepository[TransactionSplit]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(TransactionSplit, session, current_user)

class InvoiceRepository(BaseRepository[Invoice]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Invoice, session, current_user)

class FactoringRepository(BaseRepository[FactoringRequest]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FactoringRequest, session, current_user)

class InsuranceRepository(BaseRepository[CargoInsurance]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CargoInsurance, session, current_user)

class LiquidityRepository(BaseRepository[BrandLiquidity]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(BrandLiquidity, session, current_user)

class AdvancedCostingRepository(BaseRepository[AdvancedCosting]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AdvancedCosting, session, current_user)

class BudgetRepository(BaseRepository[FinanceBudget]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FinanceBudget, session, current_user)

    async def get_by_brand(self, brand_id: str, season: Optional[str] = None) -> List[FinanceBudget]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if season:
            query = query.where(self.model.season == season)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
