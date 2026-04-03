from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import ForecastRepository
from app.db.models.base import DemandForecast, User
from app.ai.modules import DemandForecastingEngine
from app.services.ai_rule_engine import AIRuleEngine
from app.core.datetime_util import utc_now

class DemandForecastingService:
    """
    Service for SKU-level Demand Forecasting.
    Vertical link: Analytics / AI Insights in Brand Profile.
    Horizontal link: Connected to AIRuleEngine for auto-replenishment and production batch triggers.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = ForecastRepository(db, current_user=current_user)
        self.ai_engine = DemandForecastingEngine()
        self.rule_engine = AIRuleEngine(db, current_user)

    async def run_forecast(self, sku_id: str, season: str, visual_trend_score: float = 1.0) -> DemandForecast:
        # 1. Get AI prediction
        ai_data = await self.ai_engine.predict(sku_id, season, visual_trend_score)
        
        # 2. Save to DB
        new_forecast = DemandForecast(
            organization_id=self.current_user.organization_id,
            sku_id=sku_id,
            season=season,
            predicted_demand=ai_data["predicted_demand"],
            confidence_score=ai_data["confidence"],
            factors_json=ai_data["factors"],
            created_at=utc_now()
        )
        forecast = await self.repo.create(new_forecast)
        
        # 3. Horizontal Integration: Trigger events based on forecast
        if forecast.predicted_demand > 500: # Example high demand threshold
            await self.rule_engine.trigger_event("analytics.high_demand_forecast", {
                "module": "analytics",
                "sku_id": sku_id,
                "predicted": forecast.predicted_demand,
                "confidence": forecast.confidence_score
            })
            
        return forecast

    async def get_latest_forecasts(
        self,
        sku_id: Optional[str] = None,
        season: Optional[str] = None,
        limit: int = 100,
    ) -> List[DemandForecast]:
        if sku_id:
            forecasts = await self.repo.get_by_sku(sku_id)
        else:
            forecasts = await self.repo.get_all(limit=limit)
        if season:
            forecasts = [f for f in forecasts if f.season == season]
        return forecasts[:limit]
