from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class DigitalTwinFeedbackBase(BaseModel):
    sku_id: str
    customer_id: str
    body_model_id: str
    fit_rating: int = Field(ge=1, le=5)
    comfort_score: int = Field(ge=1, le=5)
    comments: Optional[str] = None
    fit_visual_json: Optional[Dict] = None

class DigitalTwinFeedbackCreate(DigitalTwinFeedbackBase):
    pass

class DigitalTwinFeedback(DigitalTwinFeedbackBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class FitSummary(BaseModel):
    sku_id: str
    avg_fit_rating: float
    total_feedbacks: int
