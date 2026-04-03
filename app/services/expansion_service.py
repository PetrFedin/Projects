from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.base import User, MarketExpansion, ComplianceRequirement
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from datetime import datetime

class ExpansionService:
    """
    AI Market Expansion Service.
    Helps brands enter new countries by analyzing compliance, taxes, and logistics.
    Vertical Link: Brand OS -> Expansion Section.
    Horizontal Link: Compliance (Russian Layer) + Logistics (DDP).
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_market_analysis(self, country_code: str) -> Dict[str, Any]:
        """Returns AI-driven market analysis for expansion."""
        query = select(MarketExpansion).where(MarketExpansion.country_code == country_code)
        result = await self.db.execute(query)
        market = result.scalar_one_or_none()
        
        if not market:
            # Simulated research if not in DB
            return {
                "country_code": country_code,
                "status": "not_analyzed",
                "message": "AI Research required for this market."
            }
        
        # Get compliance requirements
        comp_query = select(ComplianceRequirement).where(ComplianceRequirement.country_code == country_code)
        comp_result = await self.db.execute(comp_query)
        requirements = comp_result.scalars().all()
        
        return {
            "country": country_code,
            "status": market.market_status,
            "financials": {
                "import_duty": market.avg_import_duty,
                "vat": market.local_vat_rate
            },
            "logistics_score": market.logistics_complexity_score,
            "compliance": [
                {"type": r.requirement_type, "desc": r.description, "mandatory": r.is_mandatory}
                for r in requirements
            ],
            "ai_verdict": "Market is attractive but requires labeling adaptation." if market.logistics_complexity_score < 5 else "High logistics risk. Consider local distributor."
        }

    async def initiate_market_entry(self, country_code: str):
        """Starts the workflow for entering a new market."""
        # Horizontal Integration: Trigger tasks for Legal and Logistics
        await self.rule_engine.trigger_event("expansion.entry_initiated", {
            "module": "expansion",
            "country": country_code,
            "brand_id": self.current_user.organization_id
        })
        logger.info(f"Expansion: Market entry initiated for {country_code}")
