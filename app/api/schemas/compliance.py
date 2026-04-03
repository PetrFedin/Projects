from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HSCodeBase(BaseModel):
    sku_id: str
    hs_code: str
    description: str
    confidence_score: float
    country_context: str

class HSCodeCreate(HSCodeBase):
    pass

class HSCode(HSCodeBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class DesignCopyrightBase(BaseModel):
    design_id: str
    brand_id: str
    blockchain_tx_hash: Optional[str] = None
    status: str = "pending"
    monitoring_active: bool = True

class DesignCopyrightCreate(DesignCopyrightBase):
    pass

class DesignCopyright(DesignCopyrightBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
