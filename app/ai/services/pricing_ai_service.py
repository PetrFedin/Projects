from typing import Dict, Any, Optional
from app.ai.models.pricing_model import PricingModel

class PricingAIService:
    def __init__(self):
        self.model = PricingModel()

    async def get_recommended_price(
        self,
        product_id: str,
        current_price: float,
        margin_min: Optional[float] = None,
        margin_max: Optional[float] = None,
        demand_signal: Optional[float] = None,
        inventory: Optional[int] = None,
        category: Optional[str] = None,
    ) -> Dict[str, Any]:
        demand_signal = demand_signal if demand_signal is not None else 0.75
        inventory = inventory if inventory is not None else 150
        recommended = self.model.predict_optimal_price(current_price, demand_signal, inventory)
        if margin_min is not None:
            recommended = max(recommended, current_price * (1 + margin_min / 100))
        if margin_max is not None:
            recommended = min(recommended, current_price * (1 + margin_max / 100))
        reason = "High demand" if demand_signal >= 0.7 else "Moderate demand"
        if category:
            reason += f" ({category})"
        return {
            "product_id": product_id,
            "current_price": current_price,
            "recommended_price": round(recommended, 2),
            "reasoning": reason + " with inventory optimization.",
            "demand_signal": demand_signal,
            "inventory_used": inventory,
        }
