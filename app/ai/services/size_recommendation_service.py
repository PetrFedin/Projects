"""
Size recommendation (Styled pattern).
Recommends garment size from measurements, fit preferences, brand charts.
"""
from typing import Any, Literal

ChartType = Literal["eu_alpha", "eu_numeric", "us", "uk", "unisex"]


class SizeRecommendationService:
    """Personal size recommendations from measurements and preferences."""

    # Alpha size charts (chest, waist, hip, inseam in cm)
    CHARTS = {
        "eu_alpha": {
            "XS": {"chest": 86, "waist": 68, "hip": 90, "inseam": 76},
            "S": {"chest": 91, "waist": 73, "hip": 95, "inseam": 78},
            "M": {"chest": 96, "waist": 78, "hip": 100, "inseam": 80},
            "L": {"chest": 102, "waist": 84, "hip": 106, "inseam": 82},
            "XL": {"chest": 107, "waist": 89, "hip": 111, "inseam": 84},
            "XXL": {"chest": 112, "waist": 94, "hip": 116, "inseam": 86},
        },
        "eu_numeric": {
            "32": {"chest": 82, "waist": 64, "hip": 86},
            "34": {"chest": 86, "waist": 68, "hip": 90},
            "36": {"chest": 90, "waist": 72, "hip": 94},
            "38": {"chest": 94, "waist": 76, "hip": 98},
            "40": {"chest": 98, "waist": 80, "hip": 102},
            "42": {"chest": 102, "waist": 84, "hip": 106},
            "44": {"chest": 106, "waist": 88, "hip": 110},
        },
        "us": {
            "XS": {"chest": 86, "waist": 66, "hip": 89, "inseam": 76},
            "S": {"chest": 91, "waist": 71, "hip": 94, "inseam": 78},
            "M": {"chest": 97, "waist": 76, "hip": 99, "inseam": 80},
            "L": {"chest": 102, "waist": 81, "hip": 104, "inseam": 82},
            "XL": {"chest": 107, "waist": 86, "hip": 109, "inseam": 84},
        },
        "uk": "us",
        "unisex": "eu_alpha",
    }

    CATEGORY_WEIGHTS = {
        "tops": {"chest": 1.2, "waist": 1.0, "hip": 0.5, "inseam": 0},
        "bottoms": {"chest": 0.3, "waist": 1.2, "hip": 1.2, "inseam": 1.0},
        "dresses": {"chest": 1.0, "waist": 1.2, "hip": 1.0, "inseam": 0.5},
        "outerwear": {"chest": 1.3, "waist": 1.0, "hip": 0.8, "inseam": 0.5},
        "shoes": {"foot_length": 1.0},
        "accessories": {},
    }

    DEFAULT_CHART = CHARTS["eu_alpha"]

    async def recommend(
        self,
        product_id: str,
        measurements: dict[str, float],
        fit_preference: str = "regular",
        category: str = "tops",
        chart: ChartType = "eu_alpha",
        include_measurements: bool = False,
    ) -> dict[str, Any]:
        """
        Recommend size. measurements: {chest, waist, hip, inseam?, foot_length?} in cm.
        fit_preference: regular | relaxed | slim | oversized
        category: tops | bottoms | dresses | outerwear | shoes | accessories
        chart: eu_alpha | eu_numeric | us | uk | unisex
        """
        c = self.CHARTS.get(chart, self.DEFAULT_CHART)
        chart_data = self.CHARTS.get(c, c) if isinstance(c, str) else c
        weights = self.CATEGORY_WEIGHTS.get(category, self.CATEGORY_WEIGHTS["tops"])
        adj = {"slim": -2, "regular": 0, "relaxed": 2, "oversized": 4}.get(fit_preference, 0)

        best_size = list(chart_data.keys())[len(chart_data) // 2]
        best_score = float("inf")
        best_chart_row = {}

        for size, row in chart_data.items():
            err = 0.0
            for key, w in weights.items():
                if w <= 0 or key not in row:
                    continue
                user_val = measurements.get(key)
                if user_val is None:
                    continue
                target = row[key] + (adj if key in ("chest", "waist", "hip") else 0)
                err += abs(target - user_val) * w
            if err < best_score:
                best_score = err
                best_size = size
                best_chart_row = row

        order = list(chart_data.keys())
        idx = order.index(best_size) if best_size in order else 0
        alts = [order[i] for i in (idx - 1, idx + 1) if 0 <= i < len(order)]

        result = {
            "product_id": product_id,
            "recommended_size": best_size,
            "confidence": round(max(0.6, 1.0 - best_score / 50), 2),
            "fit_preference": fit_preference,
            "category": category,
            "chart": chart,
            "alternative_sizes": alts[:2],
        }
        if include_measurements:
            result["chart_measurements"] = best_chart_row
        return result

    def list_charts(self) -> list[str]:
        return [k for k, v in self.CHARTS.items() if isinstance(v, dict)]

    def list_categories(self) -> list[str]:
        return list(self.CATEGORY_WEIGHTS.keys())

    def list_fit_preferences(self) -> list[str]:
        return ["slim", "regular", "relaxed", "oversized"]
