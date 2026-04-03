from typing import List, Dict, Any, Optional
from app.core.datetime_util import utc_now

class InventoryOptimizerService:
    def __init__(self):
        self.optimizer_version = "vmi_optimizer_2.0"

    async def suggest_replenishments(
        self,
        retailer_id: str,
        stock_data: List[Dict[str, Any]],
        target_days: int = 30,
        unit_cost: float = 50.0,
    ) -> Dict[str, Any]:
        """Suggest replenishment. target_days: stock coverage target (7-90)."""
        suggestions = []
        target_days = min(90, max(7, target_days))
        for item in stock_data:
            sold_7d = item.get("sold_last_7d", 0)
            stock = item.get("stock", 0)
            sell_through = (sold_7d / (stock + sold_7d)) if (stock + sold_7d) > 0 else 0
            if item.get("status") == "Low Stock" or sell_through > 0.3:
                avg_daily = sold_7d / 7.0
                target_stock = int(avg_daily * target_days)
                replenishment_qty = max(0, target_stock - stock)
                if replenishment_qty > 0:
                    urgency = "high" if stock < target_stock / 2 else ("medium" if stock < target_stock else "low")
                    suggestions.append({
                        "sku_id": item.get("sku_id"),
                        "suggested_qty": replenishment_qty,
                        "urgency": urgency,
                        "sell_through_rate": round(sell_through, 2),
                        "target_days": target_days,
                        "expected_lift": 0.15,
                    })
        cost = getattr(self, "_unit_cost", unit_cost)
        return {
            "retailer_id": retailer_id,
            "suggestions": suggestions,
            "total_value": sum(s["suggested_qty"] * cost for s in suggestions),
            "target_days": target_days,
            "optimizer": self.optimizer_version,
            "timestamp": utc_now().isoformat(),
        }

    async def calculate_size_curve_optimization(
        self, sku_id: str, region: str, category: Optional[str] = None
    ) -> Dict[str, Any]:
        """Optimal size curve for region. category: tops|bottoms|shoes affects weights."""
        if region.upper() in ("US", "NA"):
            curve = {"XS": 0.05, "S": 0.15, "M": 0.35, "L": 0.30, "XL": 0.15}
        elif region.upper() in ("EU", "UK"):
            curve = {"XS": 0.08, "S": 0.18, "M": 0.34, "L": 0.28, "XL": 0.12}
        else:
            curve = {"XS": 0.15, "S": 0.30, "M": 0.35, "L": 0.15, "XL": 0.05}
        return {"curve": curve, "region": region, "category": category}
