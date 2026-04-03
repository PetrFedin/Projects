from typing import List, Dict, Any, Optional
from app.ai.models.sku_model import SKUPerformanceModel

REGION_CURVES = {
    "US": {"XS": 0.05, "S": 0.15, "M": 0.35, "L": 0.30, "XL": 0.15},
    "EU": {"XS": 0.1, "S": 0.2, "M": 0.4, "L": 0.2, "XL": 0.1},
    "ASIA": {"XS": 0.2, "S": 0.35, "M": 0.35, "L": 0.08, "XL": 0.02},
    "RU": {"XS": 0.08, "S": 0.22, "M": 0.38, "L": 0.24, "XL": 0.08},
}


class AssortmentAIService:
    def __init__(self):
        self.sku_model = SKUPerformanceModel()

    async def generate_optimal_assortment(
        self,
        budget: float,
        categories: List[str],
        limit: int = 20,
        min_confidence: float = 0.7,
        include_costs: bool = False,
    ) -> List[Dict[str, Any]]:
        items = [
            {"product_id": "sku_101", "name": "Cyber Parka", "confidence": 0.98, "cost": 45},
            {"product_id": "sku_202", "name": "Tech Utility Pants", "confidence": 0.94, "cost": 32},
            {"product_id": "sku_303", "name": "Urban Jacket", "confidence": 0.89, "cost": 78},
        ]
        out = [i for i in items if i["confidence"] >= min_confidence][:limit]
        if not include_costs:
            for i in out:
                i.pop("cost", None)
        return out

    async def optimize_size_curve(
        self, product_id: str, region: str = "US", category: Optional[str] = None
    ) -> Dict[str, Any]:
        curve = REGION_CURVES.get(region.upper(), REGION_CURVES["EU"]).copy()
        return {
            "product_id": product_id,
            "region": region,
            "curve": curve,
            "category": category,
        }

    def list_regions(self) -> List[str]:
        return list(REGION_CURVES.keys())
