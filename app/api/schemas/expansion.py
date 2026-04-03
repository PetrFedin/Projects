from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class MarketExpansionBase(BaseModel):
    country_code: str
    market_status: str = "research"
    avg_import_duty: float = 0.0
    local_vat_rate: float = 0.0
    logistics_complexity_score: int = 1
    metadata_json: Optional[Dict] = None

class MarketExpansionCreate(MarketExpansionBase):
    pass

class MarketExpansion(MarketExpansionBase):
    id: int
    updated_at: datetime

    model_config = {"from_attributes": True}

class ComplianceRequirementBase(BaseModel):
    country_code: str
    requirement_type: str
    description: str
    is_mandatory: bool = True
    status: str = "pending"

class ComplianceRequirementCreate(ComplianceRequirementBase):
    pass

class ComplianceRequirement(ComplianceRequirementBase):
    id: int
    verified_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
