from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class DealerKPIBase(BaseModel):
    dealer_id: str
    historical_accuracy: float = 0.0
    trust_score: float = 0.0
    regional_demand_index: float = 1.0
    metadata_json: Optional[Dict] = None

class DealerKPICreate(DealerKPIBase):
    pass

class DealerKPI(DealerKPIBase):
    id: int
    updated_at: datetime

    model_config = {"from_attributes": True}

class QuotaAllocationBase(BaseModel):
    sku_id: str
    dealer_id: str
    allocated_quantity: int
    status: str = "proposed"
    reason: Optional[str] = None

class QuotaAllocationCreate(QuotaAllocationBase):
    pass

class QuotaAllocation(QuotaAllocationBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class QuotaAllocationRequest(BaseModel):
    sku_id: str
    total_quantity: int
    dealer_ids: List[str]
