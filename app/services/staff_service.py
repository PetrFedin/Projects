from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.base import User, StaffShift, ShiftSwapRequest, SalaryAdvance, StaffReward, StaffLeaderboard
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from datetime import datetime

class StaffService:
    """
    Retail Staff & HR Management Service (Staff OS).
    Manages shifts, rewards, and internal financial requests (salary advance).
    Vertical Link: Shop OS -> Staff Management.
    Horizontal Link: Fintech Hub (Payments) + Academy (Training).
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_staff_shifts(self, store_id: str) -> List[StaffShift]:
        query = select(StaffShift).where(StaffShift.store_id == store_id).order_by(StaffShift.start_time)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def request_shift_swap(self, shift_id: int, target_staff_id: str):
        """Creates a request to swap shifts with another staff member."""
        new_request = ShiftSwapRequest(
            shift_id=shift_id,
            requesting_staff_id=self.current_user.id,
            target_staff_id=target_staff_id,
            status="pending"
        )
        self.db.add(new_request)
        await self.db.commit()
        
        # Horizontal Integration: Notify target staff
        await self.rule_engine.trigger_event("staff.shift_swap_requested", {
            "module": "staff",
            "id": shift_id,
            "target": target_staff_id
        })
        return new_request

    async def request_salary_advance(self, amount: float):
        """Staff request for an early payment (salary advance)."""
        new_req = SalaryAdvance(
            staff_id=self.current_user.id,
            amount=amount,
            status="pending"
        )
        self.db.add(new_req)
        await self.db.commit()
        
        # Horizontal Integration: Request approval from Brand Finance
        await self.rule_engine.trigger_event("staff.salary_advance_requested", {
            "module": "staff",
            "id": self.current_user.id,
            "amount": amount
        })
        return new_req

    async def get_leaderboard(self, store_id: str) -> List[Dict[str, Any]]:
        query = select(StaffLeaderboard).where(StaffLeaderboard.store_id == store_id).order_by(StaffLeaderboard.points.desc())
        result = await self.db.execute(query)
        return [{"staff_id": l.staff_id, "points": l.points, "rank": i+1} for i, l in enumerate(result.scalars())]
