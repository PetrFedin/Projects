from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
from app.db.models.base import TaskStatus

class TaskBase(BaseModel):
    task_id: str
    module: str
    task_type: str
    purpose: str
    status: TaskStatus = TaskStatus.TODO
    priority: int = 1
    depends_on: Optional[str] = None
    files: Optional[Dict] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    priority: Optional[int] = None
    purpose: Optional[str] = None
    files: Optional[Dict] = None

class Task(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
