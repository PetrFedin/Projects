from typing import Optional, List
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    CompetitorSignal, ComplianceRequirement, EACCertificate, 
    ChestnyZnakCode, EDODocument, AcademyModule, AcademyTest, TestResult,
    BrandESGMetric, LoyaltyProgram, CustomerLoyalty, BrandAsset, RegionalPerformance, 
    DemandForecast, SizeCurve, SupplyChainRisk, GlobalTaxReport, SanctionCheck,
    AgentFeedback, User, DealerKPI, QuotaAllocation
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class IntelligenceRepository(BaseRepository[CompetitorSignal]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CompetitorSignal, session, current_user=current_user)

class ComplianceRepository(BaseRepository[EACCertificate]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(EACCertificate, session, current_user=current_user)

class ChestnyZnakRepository(BaseRepository[ChestnyZnakCode]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ChestnyZnakCode, session, current_user=current_user)

class EDORepository(BaseRepository[EDODocument]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(EDODocument, session, current_user=current_user)

class ESGRepository(BaseRepository[BrandESGMetric]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(BrandESGMetric, session, current_user=current_user)

class LoyaltyRepository(BaseRepository[CustomerLoyalty]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CustomerLoyalty, session, current_user=current_user)

class AssetRepository(BaseRepository[BrandAsset]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(BrandAsset, session, current_user=current_user)

class RegionalPerformanceRepository(BaseRepository[RegionalPerformance]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(RegionalPerformance, session, current_user=current_user)

class DealerKPIRepository(BaseRepository[DealerKPI]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(DealerKPI, session, current_user=current_user)

class QuotaRepository(BaseRepository[QuotaAllocation]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(QuotaAllocation, session, current_user=current_user)

class ForecastRepository(BaseRepository[DemandForecast]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(DemandForecast, session, current_user=current_user)

    async def get_by_sku(self, sku_id: str) -> List[DemandForecast]:
        query = select(self.model).where(self.model.sku_id == sku_id).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class SizeCurveRepository(BaseRepository[SizeCurve]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SizeCurve, session, current_user=current_user)

    async def get_latest_curve(self, sku_id: str, region: str) -> Optional[SizeCurve]:
        query = select(self.model).where(
            (self.model.sku_id == sku_id) & (self.model.region == region)
        ).order_by(self.model.created_at.desc()).limit(1)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class AcademyRepository(BaseRepository[AcademyModule]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AcademyModule, session, current_user=current_user)

class AcademyTestRepository(BaseRepository[AcademyTest]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AcademyTest, session, current_user=current_user)

class TestResultRepository(BaseRepository[TestResult]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(TestResult, session, current_user=current_user)

class SupplyChainRiskRepository(BaseRepository[SupplyChainRisk]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SupplyChainRisk, session, current_user=current_user)

    async def get_active_risks(self, organization_id: str) -> List[SupplyChainRisk]:
        query = select(self.model).where(
            (self.model.organization_id == organization_id) & (self.model.status == "active")
        ).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class TaxRepository(BaseRepository[GlobalTaxReport]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(GlobalTaxReport, session, current_user=current_user)

class SanctionRepository(BaseRepository[SanctionCheck]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SanctionCheck, session, current_user=current_user)


class AgentFeedbackRepository(BaseRepository[AgentFeedback]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AgentFeedback, session, current_user=current_user)

    async def get_similar_successful(
        self, task_type: str, task: str, limit: int = 5
    ) -> List[AgentFeedback]:
        """Fetch successful examples for RAG. Match by task_type and keyword overlap."""
        q = (
            select(AgentFeedback)
            .where(
                (AgentFeedback.task_type == task_type)
                & (AgentFeedback.success == True)
                & (AgentFeedback.code_changes.isnot(None))
                & (AgentFeedback.code_changes != "")
            )
            .order_by(AgentFeedback.created_at.desc())
            .limit(limit * 3)
        )
        if self.current_user and self.current_user.role != "platform_admin":
            q = q.where(
                (AgentFeedback.organization_id == self.current_user.organization_id)
                | (AgentFeedback.organization_id.is_(None))
            )
        result = await self.session.execute(q)
        rows = list(result.scalars().all())
        task_words = set(w.lower() for w in task.split() if len(w) > 2)
        scored = []
        for r in rows:
            stored_words = set(w.lower() for w in (r.task or "").split() if len(w) > 2)
            overlap = len(task_words & stored_words) if task_words else 1
            scored.append((overlap, r))
        scored.sort(key=lambda x: -x[0])
        return [r for _, r in scored[:limit]]
