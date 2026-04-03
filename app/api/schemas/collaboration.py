from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class CollaborationBase(BaseModel):
    owner_brand_id: str
    partner_brand_id: str
    project_name: str
    description: Optional[str] = None
    status: str = "active"

class CollaborationCreate(CollaborationBase):
    pass

class CollaborationProject(CollaborationBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class AccessControlBase(BaseModel):
    project_id: int
    user_id: str
    access_level: str
    resource_type: str

class AccessControlCreate(AccessControlBase):
    pass

class ProjectAccessControl(AccessControlBase):
    id: int
    model_config = {"from_attributes": True}
