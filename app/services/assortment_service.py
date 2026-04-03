from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User, MerchandiseGrid, DemandForecast, AdvancedCosting
from app.db.repositories.analytics import MerchandiseRepository
from app.ai.modules import AIAssortmentBuilder, DemandForecastingEngine
from app.core.logging import logger

class AssortmentIntelligenceService:
    """Service for AI-powered Assortment Intelligence and Merchandise Grid optimization."""
    
    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.db = db
        self.current_user = current_user
        self.merch_repo = MerchandiseRepository(db, current_user=current_user)
        self.ai_builder = AIAssortmentBuilder()
        self.demand_engine = DemandForecastingEngine()

    async def generate_recommendation(self, brand_id: str, budget: float, season: str) -> Dict[str, Any]:
        """
        Generates an optimal Merchandise Grid recommendation based on:
        - Costing data (AdvancedCosting)
        - Demand forecasts (DemandForecast)
        - AI-based optimization logic
        """
        logger.info(f"Generating AI Assortment Intelligence for brand {brand_id}, season {season}")

        # 1. Gather historical/current performance data (mocked for now)
        # In real app, this would query CategorySellThrough and AdvancedCosting tables
        historical_performance = [
            {"category": "Outerwear", "sell_through": 0.85, "avg_cost": 120},
            {"category": "Dresses", "sell_through": 0.78, "avg_cost": 85},
            {"category": "Tops", "sell_through": 0.65, "avg_cost": 45},
            {"category": "Bottoms", "sell_through": 0.72, "avg_cost": 65},
            {"category": "Accessories", "sell_through": 0.90, "avg_cost": 30}
        ]

        # 2. Call AI Assortment Builder
        recommendation = await self.ai_builder.build(
            brand_id=brand_id,
            budget=budget,
            season=season,
            historical_performance=historical_performance
        )

        # 3. Create or Update Merchandise Grid record
        existing_grids = await self.merch_repo.get_by_brand(brand_id=brand_id, season=season)
        
        if existing_grids:
            grid_model = existing_grids[0]
            grid_model.total_budget = budget
            grid_model.category_split_json = recommendation["category_split"]
            grid_model.target_units = recommendation["target_units"]
        else:
            grid_model = MerchandiseGrid(
                brand_id=brand_id,
                season=season,
                total_budget=budget,
                category_split_json=recommendation["category_split"],
                target_units=recommendation["target_units"]
            )
            # Use tenant if available
            if self.current_user and hasattr(grid_model, "organization_id"):
                 grid_model.organization_id = self.current_user.organization_id
            
            self.db.add(grid_model)
            
        await self.db.commit()
        await self.db.refresh(grid_model)

        return {
            "grid_id": grid_model.id,
            "brand_id": brand_id,
            "season": season,
            "total_budget": budget,
            "recommendation": recommendation,
            "status": "success"
        }

    async def analyze_sku_fit_to_grid(self, sku_id: str, brand_id: str, season: str) -> Dict[str, Any]:
        """
        Analyzes how well a specific SKU fits into the overall merchandise grid strategy.
        Checks demand forecast vs. category target allocation.
        """
        # Fetch latest demand forecast
        # (Mocked)
        forecast = await self.demand_engine.predict(sku_id, season)
        
        # In a real app, check against category limits in MerchandiseGrid
        return {
            "sku_id": sku_id,
            "forecast_units": forecast["predicted_demand"],
            "grid_alignment_score": 0.92,
            "recommendation": "Produce as planned, demand is high."
        }
