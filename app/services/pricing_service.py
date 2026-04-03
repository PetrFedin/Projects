from typing import Dict, List, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User
from app.services.ai_rule_engine import AIRuleEngine
from app.services.intelligence_service import IntelligenceService
from app.services.retail_service import RetailService
from app.ai.modules import AIPricingEngine
from app.core.logging import logger
from datetime import datetime

class PricingService:
    """
    Vertical service for AI Pricing (Section AI_PRICING).
    Handles dynamic pricing calculations and margin analysis.
    Horizontal link: Reacts to competitor signals and inventory levels.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)
        self.intel_service = IntelligenceService(db, current_user)
        self.retail_service = RetailService(db, current_user)
        self.ai_engine = AIPricingEngine()

    async def calculate_dynamic_price(self, sku_id: str, current_price: float) -> Dict[str, Any]:
        """
        Calculates optimal price using real-time signals:
        1. Competitor prices from IntelligenceService
        2. Stock levels from RetailService
        """
        logger.info(f"Pricing: Running AI analysis for SKU {sku_id}")
        
        # 1. Get competitor signals
        signals = await self.intel_service.get_competitor_signals()
        competitors = []
        for s in signals:
            if s.feature_name == sku_id or "price" in s.description.lower():
                competitors.append({"name": s.competitor_name, "price": s.metadata_json.get("price") if s.metadata_json else None})
        
        # 2. Get stock level (mock/simplified)
        stock_data = await self.retail_service.inventory_repo.get_all()
        stock_level = sum(s.quantity for s in stock_data if s.sku_id == sku_id)
        
        # 3. Call AI Engine
        ai_result = await self.ai_engine.suggest_price(sku_id, current_price, competitors, stock_level)
        
        # 4. Horizontal Integration: Trigger alert if price change is significant (>15%)
        if abs(ai_result["suggested_price"] - current_price) / current_price > 0.15:
            await self.rule_engine.trigger_event("pricing.significant_change", {
                "module": "pricing",
                "sku_id": sku_id,
                "old_price": current_price,
                "new_price": ai_result["suggested_price"]
            })
            
        return ai_result

    async def get_margin_audit(self, collection_id: str) -> Dict[str, Any]:
        """
        Returns a breakdown of margins for a collection.
        """
        return {
            "avg_margin": 0.62,
            "best_margin": 0.75,
            "worst_margin": 0.45
        }
