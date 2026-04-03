from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from app.api import deps
from app.db.models.base import User, MediaAsset, Order
from app.api.schemas.base import GenericResponse
from app.ai.modules import DemandForecastingEngine
from app.db.repositories.base import BaseRepository

router = APIRouter()

class MediaRepository(BaseRepository[MediaAsset]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MediaAsset, session, current_user)

class OrderRepository(BaseRepository[Order]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Order, session, current_user)

@router.get("/insights", response_model=GenericResponse[Dict[str, Any]])
async def get_personalized_insights(
    top_picks_limit: int = 5,
    region: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """top_picks_limit: max recommendations. region: optional filter for trends."""
    if current_user.role not in ["buyer", "buyer_admin"]:
        raise HTTPException(status_code=403, detail="Only buyers can access personalized insights")
    order_repo = OrderRepository(db, current_user=current_user)
    recent_orders = await order_repo.get_all(limit=min(top_picks_limit, 20))
    
    # 3. Simulate AI generating personalized recommendations
    # In a real scenario, we'd call an Agent or Recommendation Engine
    
    top_picks = [
            {
                "sku_id": "SKU_TECH_001",
                "reason": "Matches your preference for Techwear",
                "predicted_sell_through": 0.89
            },
            {
                "sku_id": "SKU_MIN_002",
                "reason": f"Trending in your region ({region or 'Moscow'})",
                "predicted_sell_through": 0.94
            }
        ]
    insights = {
        "summary": f"Welcome back, {current_user.email}. Based on your history with {len(recent_orders)} orders, we found new opportunities.",
        "top_picks": top_picks[:top_picks_limit],
        "region": region,
        "market_trends": [
            "Techwear demand is up 15% this season",
            "Blue shades are outperforming neutrals in your segment"
        ],
        "action_items": [
            "Review FW26 collection for early-bird discounts",
            "Update your replenishment rules for high-demand SKUs"
        ]
    }
    
    return GenericResponse(data=insights)
