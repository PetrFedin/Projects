from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import LoyaltyRepository
from app.db.models.base import CustomerLoyalty, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class LoyaltyService:
    """
    Service for CRM & Loyalty: Brand customer retention and reward programs.
    Vertical link: Loyalty tab in Brand Profile.
    Horizontal link: Triggered by ESG sustainability actions or B2B sales volume.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = LoyaltyRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_customer_loyalty(self, customer_id: str) -> Optional[CustomerLoyalty]:
        """Returns customer points and tier."""
        # This repo.get would normally take ID, but we want it by customer_id string
        # Using a simplified version for now
        results = await self.repo.get_all()
        return next((c for c in results if c.customer_id == customer_id), None)

    async def add_points(self, customer_id: str, amount: int, reason: str = "purchase") -> CustomerLoyalty:
        customer = await self.get_customer_loyalty(customer_id)
        if not customer:
            customer = CustomerLoyalty(
                organization_id=self.current_user.organization_id,
                customer_id=customer_id,
                points=0,
                tier="standard"
            )
            customer = await self.repo.create(customer)
        
        customer.points += amount
        customer.last_interaction = utc_now()
        
        # Simple tier logic
        if customer.points > 1000:
            customer.tier = "silver"
        if customer.points > 5000:
            customer.tier = "gold"
            
        await self.db.commit()
        await self.db.refresh(customer)
        
        # Horizontal Integration: Trigger event for points added
        await self.rule_engine.trigger_event("loyalty.points_added", {
            "module": "loyalty",
            "customer_id": customer_id,
            "points": amount,
            "reason": reason
        })
        
        return customer

    async def reward_sustainability_action(self, customer_id: str) -> CustomerLoyalty:
        """Rewards a customer with 50 points for an ESG-related action (e.g. recycling)."""
        return await self.add_points(customer_id, 50, reason="sustainability_action")
