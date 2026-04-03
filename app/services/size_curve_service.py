from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import SizeCurveRepository
from app.db.models.base import SizeCurve, User
from app.ai.modules import SizeCurveOptimizer
from app.services.ai_rule_engine import AIRuleEngine
from app.core.datetime_util import utc_now

class SizeCurveService:
    """
    Service for Size Curve Optimization (S/M/L/XL distribution).
    Vertical link: Strategy / AI Insights in Brand Profile.
    Horizontal link: Used by Production (PLM) for ordering materials and Distributor for allocations.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = SizeCurveRepository(db, current_user=current_user)
        self.ai_optimizer = SizeCurveOptimizer()
        self.rule_engine = AIRuleEngine(db, current_user)

    async def calculate_size_curve(self, sku_id: str, region: str, category: Optional[str] = None) -> SizeCurve:
        # 1. Run AI optimization
        ai_result = await self.ai_optimizer.optimize(sku_id, region)
        
        # 2. Save to DB
        new_curve = SizeCurve(
            organization_id=self.current_user.organization_id,
            sku_id=sku_id,
            region=region,
            curve_json=ai_result["curve"],
            confidence_score=ai_result["confidence"],
            created_at=utc_now()
        )
        curve = await self.repo.create(new_curve)
        
        # 3. Horizontal Integration: Notify production about optimal size split
        evt = {"module": "analytics", "sku_id": sku_id, "region": region, "curve": ai_result["curve"]}
        if category:
            evt["category"] = category
        await self.rule_engine.trigger_event("analytics.size_curve_calculated", evt)
        
        return curve

    async def get_latest_curve(self, sku_id: str, region: str) -> Optional[SizeCurve]:
        return await self.repo.get_latest_curve(sku_id, region)
