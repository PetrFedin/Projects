from typing import Dict, Any, List

class SalesAnalytics:
    async def get_sell_through_report(self, brand_id: str) -> Dict[str, Any]:
        return {
            "brand_id": brand_id,
            "overall_sell_through": 0.78,
            "top_performing_categories": ["outerwear", "knitwear"],
            "period": "Last 30 Days"
        }

class InventoryAnalytics:
    async def detect_stock_risks(self) -> List[Dict[str, Any]]:
        return [
            {"sku": "SKU-9921", "risk": "Low Stock / High Demand", "urgency": "High"},
            {"sku": "SKU-4412", "risk": "Overstock / Low Demand", "urgency": "Medium"}
        ]

class BrandGrowthAnalytics:
    async def calculate_reputation_score(self, brand_id: str) -> float:
        # Aggregates returns, feedback, and fulfillment speed
        return 4.85
