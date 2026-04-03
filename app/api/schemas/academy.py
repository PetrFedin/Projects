from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class AcademyModuleBase(BaseModel):
    brand_id: Optional[str] = None
    title: str
    content_url: str
    category: str
    is_active: bool = True

class AcademyModuleCreate(AcademyModuleBase):
    pass

class AcademyModule(AcademyModuleBase):
    id: int
    model_config = {"from_attributes": True}

class AcademyTestBase(BaseModel):
    module_id: int
    questions_json: Dict
    passing_score: int = 80

class AcademyTestCreate(AcademyTestBase):
    pass

class AcademyTest(AcademyTestBase):
    id: int
    model_config = {"from_attributes": True}

class TestResultBase(BaseModel):
    staff_id: str
    test_id: int
    score: int
    is_passed: bool = False

class TestResultCreate(TestResultBase):
    pass

class TestResult(TestResultBase):
    id: int
    completed_at: datetime
    model_config = {"from_attributes": True}

class LeaderboardBase(BaseModel):
    staff_id: str
    brand_id: str
    points: int = 0
    sales_count: int = 0
    customer_rating: float = 0.0
    rank_title: str = "Junior Stylist"

class LeaderboardCreate(LeaderboardBase):
    pass

class StaffLeaderboard(LeaderboardBase):
    id: int
    last_updated: datetime
    model_config = {"from_attributes": True}
