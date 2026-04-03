from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GlobalRiskBase(BaseModel):
    region: str
    risk_level: str # low, medium, high, critical
    description: str
    impact_score: float
    mitigation_plan: Optional[str] = None
    is_active: bool = True

class GlobalRiskCreate(GlobalRiskBase):
    pass

class GlobalRisk(GlobalRiskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class RiskAnalysisRequest(BaseModel):
    region: str
    context: Optional[str] = None
