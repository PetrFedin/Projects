from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class AuditTrailBase(BaseModel):
    entity_type: str
    entity_id: str
    action: str
    changes_json: Optional[Dict] = None
    user_id: str

class AuditTrailCreate(AuditTrailBase):
    pass

class AuditTrail(AuditTrailBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
