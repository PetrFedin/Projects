from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class StaffRewardBase(BaseModel):
    staff_id: str
    store_id: str
    points: int = 0
    achievement_name: str
    metadata_json: Optional[Dict] = None

class RewardCreate(StaffRewardBase):
    pass

class StaffReward(StaffRewardBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class LeaderboardEntry(BaseModel):
    staff_id: str
    total_points: int

class SwapRequestBase(BaseModel):
    requester_staff_id: str
    target_staff_id: str
    original_shift_id: int
    status: str = "pending"

class SwapRequestCreate(SwapRequestBase):
    pass

class ShiftSwapRequest(SwapRequestBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class SalaryAdvanceBase(BaseModel):
    staff_id: str
    amount: float
    status: str = "requested"

class SalaryAdvanceCreate(SalaryAdvanceBase):
    pass

class SalaryAdvance(SalaryAdvanceBase):
    id: int
    request_date: datetime
    model_config = {"from_attributes": True}
