from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import RegionalPerformanceRepository, DealerKPIRepository, QuotaRepository
from app.db.models.base import User, RegionalPerformance, DealerKPI, QuotaAllocation
from app.services.ai_rule_engine import AIRuleEngine
from app.core.datetime_util import utc_now

class DistributorService:
    """
    Service for Distributor OS: Quota Management, Regional Performance, and Dealer KPIs.
    Vertical link: Distributor Profile hub.
    Horizontal link: Connected to AI Rule Engine for stock redistribution and credit limit alerts.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.performance_repo = RegionalPerformanceRepository(db, current_user=current_user)
        self.kpi_repo = DealerKPIRepository(db, current_user=current_user)
        self.quota_repo = QuotaRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    # --- Regional Analytics ---
    async def get_regional_performance(self, region: Optional[str] = None) -> List[RegionalPerformance]:
        results = await self.performance_repo.get_all()
        if region:
            return [r for r in results if r.region == region]
        return results

    async def record_performance(self, data: Dict[str, Any]) -> RegionalPerformance:
        new_perf = RegionalPerformance(
            organization_id=self.current_user.organization_id,
            **data,
            recorded_at=utc_now()
        )
        perf = await self.performance_repo.create(new_perf)
        
        # Horizontal Integration: Alert if sales are dropping in a key region
        if perf.total_sales < 10000: # Example low threshold
            await self.rule_engine.trigger_event("distributor.low_performance_alert", {
                "module": "distributor",
                "region": perf.region,
                "sales": perf.total_sales
            })
        return perf

    # --- Quota Allocation ---
    async def allocate_quota(self, sku_id: str, dealer_id: str, quantity: int) -> QuotaAllocation:
        new_quota = QuotaAllocation(
            sku_id=sku_id,
            dealer_id=dealer_id,
            allocated_quantity=quantity,
            status="proposed",
            created_at=utc_now()
        )
        quota = await self.quota_repo.create(new_quota)
        
        # Horizontal Integration: Notify dealer about new quota
        await self.rule_engine.trigger_event("distributor.quota_allocated", {
            "module": "distributor",
            "dealer_id": dealer_id,
            "sku_id": sku_id,
            "qty": quantity
        })
        return quota

    # --- Dealer KPIs ---
    async def get_dealer_kpi(self, dealer_id: str) -> Optional[DealerKPI]:
        results = await self.kpi_repo.get_all()
        return next((k for k in results if k.dealer_id == dealer_id), None)

    async def update_dealer_score(self, dealer_id: str, trust_score: float) -> DealerKPI:
        kpi = await self.get_dealer_kpi(dealer_id)
        if not kpi:
            kpi = DealerKPI(dealer_id=dealer_id, trust_score=trust_score)
            kpi = await self.kpi_repo.create(kpi)
        else:
            kpi.trust_score = trust_score
            kpi.updated_at = utc_now()
            await self.db.commit()
            await self.db.refresh(kpi)
            
        return kpi
