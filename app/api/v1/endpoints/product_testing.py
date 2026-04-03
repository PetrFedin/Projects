from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.db.repositories.product_testing import DigitalTwinRepository
from app.api.schemas.product_testing import DigitalTwinFeedback, DigitalTwinFeedbackCreate, FitSummary
from app.db.models.base import DigitalTwinFeedback as FeedbackModel

router = APIRouter()

@router.get("/feedback/{sku_id}", response_model=List[DigitalTwinFeedback])
async def get_sku_feedback(sku_id: str, db: AsyncSession = Depends(get_db)):
    repo = DigitalTwinRepository(db)
    return await repo.get_by_sku(sku_id)

@router.post("/feedback", response_model=DigitalTwinFeedback)
async def submit_feedback(feedback_in: DigitalTwinFeedbackCreate, db: AsyncSession = Depends(get_db)):
    repo = DigitalTwinRepository(db)
    new_feedback = FeedbackModel(**feedback_in.model_dump())
    return await repo.create(new_feedback)

@router.get("/summary/{sku_id}", response_model=FitSummary)
async def get_fit_summary(sku_id: str, db: AsyncSession = Depends(get_db)):
    repo = DigitalTwinRepository(db)
    avg_rating = await repo.get_average_rating(sku_id)
    feedbacks = await repo.get_by_sku(sku_id)
    return {
        "sku_id": sku_id,
        "avg_fit_rating": avg_rating,
        "total_feedbacks": len(feedbacks)
    }
