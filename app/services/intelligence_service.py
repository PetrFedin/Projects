from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import IntelligenceRepository
from app.db.models.base import CompetitorSignal, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class IntelligenceService:
    """
    Service for Market Intelligence: Competitor radar and industry trends.
    Vertical link: AI Insights / Competitor Radar in Brand Profile.
    Horizontal link: Connected to AI Rule Engine for strategic alerts.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = IntelligenceRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_competitor_signals(
        self, skip: int = 0, limit: int = 100
    ) -> List[CompetitorSignal]:
        """Returns signals about competitors relevant to the brand."""
        return await self.repo.get_all(skip=skip, limit=limit)

    async def add_signal(self, competitor_name: str, feature_name: str, signal_type: str, description: str, url: Optional[str] = None) -> CompetitorSignal:
        new_signal = CompetitorSignal(
            organization_id=self.current_user.organization_id,
            competitor_name=competitor_name,
            feature_name=feature_name,
            signal_type=signal_type,
            description=description,
            url=url,
            created_at=utc_now()
        )
        signal = await self.repo.create(new_signal)
        
        # Horizontal Integration: Alert if competitor launches a major feature
        if signal_type == "feature" and "launch" in description.lower():
            await self.rule_engine.trigger_event("intelligence.competitor_launch", {
                "module": "intelligence",
                "competitor": competitor_name,
                "feature": feature_name
            })
            
        return signal

    async def analyze_task(self, task: str) -> CompetitorSignal:
        """AI-driven analysis: creates a competitor signal from the task."""
        signal_type = "trend" if "trend" in task.lower() or "pricing" in task.lower() else "feature"
        new_signal = CompetitorSignal(
            organization_id=self.current_user.organization_id,
            competitor_name="Market",
            feature_name=task[:100],
            signal_type=signal_type,
            description=f"AI analysis: {task}",
            url=None,
            created_at=utc_now(),
        )
        return await self.repo.create(new_signal)

    async def get_trend_radar(
        self,
        category: Optional[str] = None,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """Simulates AI-driven trend analysis. category: filter by impact/momentum."""
        trends = [
            {"name": "Quiet Luxury", "momentum": "high", "impact": "high"},
            {"name": "Bio-fabricated Materials", "momentum": "medium", "impact": "critical"},
            {"name": "Hyper-personalization", "momentum": "high", "impact": "medium"},
            {"name": "Circular Design", "momentum": "high", "impact": "high"},
            {"name": "Digital Twins", "momentum": "medium", "impact": "medium"},
        ]
        if category:
            trends = [t for t in trends if t.get("impact") == category or t.get("momentum") == category]
        return {"trends": trends[:limit], "category_filter": category}
