from typing import Optional, List
from app.db.repositories.base import BaseRepository
from app.db.models.base import SmartContract, ContractExecutionLog, FinanceBudget, AdvancedCosting, User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class ContractRepository(BaseRepository[SmartContract]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SmartContract, session, current_user=current_user)

    async def get_active_contracts(self, organization_id: str) -> List[SmartContract]:
        query = select(self.model).where(
            (self.model.organization_id == organization_id) & (self.model.status == "active")
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ContractExecutionRepository(BaseRepository[ContractExecutionLog]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ContractExecutionLog, session, current_user=current_user)

class FinanceBudgetRepository(BaseRepository[FinanceBudget]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FinanceBudget, session, current_user=current_user)

class AdvancedCostingRepository(BaseRepository[AdvancedCosting]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(AdvancedCosting, session, current_user=current_user)
