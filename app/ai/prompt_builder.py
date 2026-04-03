from typing import Dict, Any, List

class PromptBuilder:
    """
    Constructs structured prompts for different AI modules.
    Ensures consistent tone and context injection.
    """
    @staticmethod
    def build_product_description(sku_data: Dict[str, Any], tone: str = "luxury") -> str:
        return f"Generate a {tone} product description for the following item: {sku_data}"

    @staticmethod
    def build_order_validation(order_data: Dict[str, Any], brand_rules: List[str]) -> str:
        return f"Validate this order against the following brand rules: {brand_rules}. Order: {order_data}"

    @staticmethod
    def build_trend_analysis(market_signals: List[Dict[str, Any]]) -> str:
        return f"Analyze the following market signals and detect emerging trends: {market_signals}"
