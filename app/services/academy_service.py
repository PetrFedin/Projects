from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import AcademyRepository, AcademyTestRepository, TestResultRepository
from app.db.models.base import AcademyModule, AcademyTest, TestResult, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class AcademyService:
    """
    Service for Brand Academy: Staff training and certification.
    Vertical link: Academy section in Brand Profile.
    Horizontal link: Connected to AIRuleEngine for certification rewards or role upgrades.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.module_repo = AcademyRepository(db, current_user=current_user)
        self.test_repo = AcademyTestRepository(db, current_user=current_user)
        self.result_repo = TestResultRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_available_modules(self) -> List[AcademyModule]:
        return await self.module_repo.get_all()

    async def submit_test_result(self, test_id: int, score: int) -> TestResult:
        test = await self.test_repo.get(test_id)
        if not test:
            raise ValueError("Test not found")
            
        is_passed = score >= test.passing_score
        
        new_result = TestResult(
            staff_id=self.current_user.id,
            test_id=test_id,
            score=score,
            is_passed=is_passed,
            completed_at=utc_now()
        )
        result = await self.result_repo.create(new_result)
        
        if is_passed:
            # Horizontal Integration: Trigger event for passed certification
            await self.rule_engine.trigger_event("academy.certification_passed", {
                "module": "academy",
                "id": result.id,
                "staff_id": self.current_user.id,
                "test_id": test_id
            })
            
        return result

    async def create_module(self, data: Dict[str, Any]) -> AcademyModule:
        new_mod = AcademyModule(**data)
        return await self.module_repo.create(new_mod)

    async def create_test(self, data: Dict[str, Any]) -> AcademyTest:
        new_test = AcademyTest(**data)
        return await self.test_repo.create(new_test)

    async def submit_result_for_staff(
        self, staff_id: str, test_id: int, score: int, is_passed: bool
    ) -> TestResult:
        new_result = TestResult(
            staff_id=staff_id,
            test_id=test_id,
            score=score,
            is_passed=is_passed,
            completed_at=utc_now(),
        )
        return await self.result_repo.create(new_result)

    async def get_staff_results(self, staff_id: str) -> List[TestResult]:
        from sqlalchemy import select
        stmt = select(TestResult).where(TestResult.staff_id == staff_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
