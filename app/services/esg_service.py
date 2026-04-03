from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import ESGRepository
from app.db.models.base import BrandESGMetric, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class ESGService:
    """
    Service for Brand ESG (Environmental, Social, Governance) Monitoring.
    Vertical link: ESG Impact tab in Brand Profile.
    Horizontal link: Connected to AI Rule Engine for transparency and reward triggers.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = ESGRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def record_metric(self, category: str, value: float, unit: str, period: str = "monthly") -> BrandESGMetric:
        new_metric = BrandESGMetric(
            organization_id=self.current_user.organization_id,
            category=category,
            value=value,
            unit=unit,
            period=period,
            recorded_at=utc_now()
        )
        metric = await self.repo.create(new_metric)
        
        # Horizontal Integration: Trigger alert if carbon footprint is high
        if category == "carbon_footprint" and value > 5000: # Example threshold
            await self.rule_engine.trigger_event("esg.high_carbon_alert", {
                "module": "esg",
                "id": metric.id,
                "value": value,
                "unit": unit
            })
            
        return metric

    async def get_latest_metrics(self) -> List[BrandESGMetric]:
        return await self.repo.get_all()

    async def simulate_annual_impact(self) -> Dict[str, Any]:
        """Simulates carbon footprint based on materials used in ProductionService."""
        # In a real app, this would query MaterialOrder and Production models
        return {
            "carbon_footprint": {"value": 1240.5, "unit": "kg_co2", "trend": -5.2},
            "water_usage": {"value": 850, "unit": "m3", "trend": -10.0},
            "recyclability": {"value": 78, "unit": "percentage", "trend": +15.0}
        }
