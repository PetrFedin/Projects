from typing import Dict, Any

class SKUFeatures:
    @staticmethod
    def extract(raw_product: Dict[str, Any]) -> Dict[str, float]:
        """Transform raw product data into ML features."""
        return {
            "price_index": float(raw_product.get("price", 0)) / 100.0,
            "category_encoded": 1.0 if raw_product.get("category") == "outerwear" else 0.0,
            "is_new": 1.0 if raw_product.get("is_new") else 0.0,
            "stock_level": float(raw_product.get("inventory_count", 0))
        }

class BrandFeatures:
    @staticmethod
    def extract(raw_brand: Dict[str, Any]) -> Dict[str, float]:
        return {
            "reputation_score": float(raw_brand.get("rating", 4.5)) / 5.0,
            "order_fulfillment_rate": float(raw_brand.get("fulfillment_rate", 0.95)),
            "age_years": float(raw_brand.get("years_active", 1))
        }

class SalesFeatures:
    @staticmethod
    def extract(sales_history: Dict[str, Any]) -> Dict[str, float]:
        return {
            "rolling_7d_sales": float(sales_history.get("sum_7d", 0)),
            "sell_through_rate": float(sales_history.get("sell_through", 0)),
            "return_rate": float(sales_history.get("return_rate", 0))
        }
