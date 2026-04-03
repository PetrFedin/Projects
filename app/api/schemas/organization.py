from typing import Optional, List, Dict
from pydantic import BaseModel
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str
    type: str  # "brand", "buyer", "distributor", "factory"
    is_active: bool = True
    metadata_json: Optional[Dict] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(OrganizationBase):
    pass

class OrganizationInDBBase(OrganizationBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class Organization(OrganizationInDBBase):
    pass
