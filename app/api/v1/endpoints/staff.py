from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.staff_service import StaffService
from pydantic import BaseModel

router = APIRouter()

class ShiftSwapRequestCreate(BaseModel):
    shift_id: int
    target_staff_id: str

class SalaryAdvanceRequest(BaseModel):
    amount: float

@router.get("/shifts/{store_id}", response_model=List[Dict[str, Any]])
async def get_shifts(
    store_id: str,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns shifts for a store."""
    service = StaffService(db, current_user)
    shifts = await service.get_staff_shifts(store_id)
    return [{"id": s.id, "start": s.start_time, "end": s.end_time, "staff": s.staff_id} for s in shifts[:limit]]

@router.post("/shifts/swap")
async def request_swap(
    data: ShiftSwapRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Requests a shift swap."""
    service = StaffService(db, current_user)
    await service.request_shift_swap(data.shift_id, data.target_staff_id)
    return {"status": "success", "message": "Shift swap requested."}

@router.post("/salary-advance")
async def request_advance(
    data: SalaryAdvanceRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Requests a salary advance."""
    service = StaffService(db, current_user)
    await service.request_salary_advance(data.amount)
    return {"status": "success", "message": "Salary advance requested."}

@router.get("/leaderboard/{store_id}")
async def get_leaderboard(
    store_id: str,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns the staff leaderboard for a store."""
    service = StaffService(db, current_user)
    board = await service.get_leaderboard(store_id)
    items = board if isinstance(board, list) else [board]
    return items[:limit]
