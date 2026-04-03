from typing import Dict, List, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import Order, User
from app.db.repositories.wholesale import MOQRepository, CreditLimitRepository
from app.core.datetime_util import utc_now

class RuleEngine:
    """
    Centralized service for business rules validation.
    Handles MOQ, Credit Limits, and Seasonality constraints.
    """
    def __init__(self, db: AsyncSession, current_user: Optional[User] = None):
        self.db = db
        self.current_user = current_user

    async def validate_order(self, order: Order) -> Dict[str, Any]:
        """
        Validates an order against brand-specific rules (MOQ and Credit Limits).
        """
        errors = []
        
        # 1. Basic Amount Check
        if order.total_amount <= 0:
            errors.append("Order amount must be greater than zero")

        # 2. MOQ (Minimum Order Quantity) Check
        moq_repo = MOQRepository(self.db, current_user=self.current_user)
        items = order.items_json.get("items", []) if isinstance(order.items_json, dict) else []
        
        for item in items:
            sku_id = item.get("sku_id")
            quantity = item.get("quantity", 0)
            
            moq_setting = await moq_repo.get_by_sku(sku_id)
            if moq_setting and quantity < moq_setting.min_units:
                errors.append(f"Product {sku_id} does not meet minimum order quantity ({moq_setting.min_units} units)")

        # 3. Credit Limit Check
        credit_repo = CreditLimitRepository(self.db, current_user=self.current_user)
        credit_limit = await credit_repo.get_by_partner(order.buyer_id)
        
        if credit_limit:
            available_credit = credit_limit.total_limit - credit_limit.used_amount
            if order.total_amount > available_credit:
                errors.append(f"Order amount exceeds available credit limit (Available: {available_credit} {credit_limit.currency})")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "timestamp": utc_now().isoformat()
        }

    async def check_inventory_availability(self, items: List[Dict]) -> bool:
        # ATS (Available to Sell) check: stub until inventory/retail sync is wired
        return True
