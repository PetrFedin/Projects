from typing import List, Dict, Any, Optional

TRENDS_BY_CATEGORY = {
    "footwear": [{"trend": "Chunky soles", "score": 0.92, "velocity": "increasing"}, {"trend": "Retro sneakers", "score": 0.85, "velocity": "stable"}],
    "outerwear": [{"trend": "Oversized coats", "score": 0.9, "velocity": "increasing"}, {"trend": "Puffer revival", "score": 0.87, "velocity": "stable"}],
    "knitwear": [{"trend": "Cable knit", "score": 0.88, "velocity": "stable"}, {"trend": "Cropped cardigan", "score": 0.82, "velocity": "increasing"}],
    "accessories": [{"trend": "Mini bags", "score": 0.91, "velocity": "increasing"}, {"trend": "Chain straps", "score": 0.84, "velocity": "stable"}],
    "default": [
        {"trend": "Cyberpunk Utility", "score": 0.95, "velocity": "increasing"},
        {"trend": "Eco-Minimalism", "score": 0.88, "velocity": "stable"},
        {"trend": "Quiet luxury", "score": 0.86, "velocity": "increasing"},
        {"trend": "Y2K revival", "score": 0.8, "velocity": "stable"},
        {"trend": "Technical fabrics", "score": 0.78, "velocity": "increasing"},
    ],
}


class TrendRadarService:
    def __init__(self):
        self.model = None

    async def get_emerging_trends(
        self, category: Optional[str] = None, limit: int = 10
    ) -> List[Dict[str, Any]]:
        base = TRENDS_BY_CATEGORY.get((category or "").lower(), TRENDS_BY_CATEGORY["default"])
        return base[:limit]

    async def analyze_signals(
        self,
        signals: List[Dict[str, Any]],
        min_score: float = 0.5,
    ) -> Dict[str, Any]:
        count = len(signals)
        high = sum(1 for s in signals if s.get("score", 0) >= 0.8)
        return {
            "status": "analyzed",
            "trend_impact": "high" if high > count / 2 else "medium",
            "signals_count": count,
            "high_confidence_count": high,
            "min_score_filter": min_score,
        }
