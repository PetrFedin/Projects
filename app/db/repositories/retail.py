from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    GiftRegistry, ReplenishmentRequest, StaffTraining, StoreExpense, 
    InventorySyncLog, StaffShift,     RepairRequest, FittingRoomBooking, StoreInventory, POSTransaction, CustomerClienteling, User
)

class GiftRegistryRepository(BaseRepository[GiftRegistry]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(GiftRegistry, session, current_user)

    async def get_by_user(self, user_id: str) -> List[GiftRegistry]:
        query = select(self.model).where(self.model.user_id == user_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_public_registries(self) -> List[GiftRegistry]:
        query = select(self.model).where(self.model.is_public == True)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ReplenishmentRepository(BaseRepository[ReplenishmentRequest]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ReplenishmentRequest, session, current_user)

    async def get_by_store(self, store_id: str) -> List[ReplenishmentRequest]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class TrainingRepository(BaseRepository[StaffTraining]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(StaffTraining, session, current_user)

    async def get_by_staff(self, staff_id: str) -> List[StaffTraining]:
        query = select(self.model).where(self.model.staff_id == staff_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ExpenseRepository(BaseRepository[StoreExpense]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(StoreExpense, session, current_user)

    async def get_monthly_report(self, store_id: str, month: int, year: int) -> List[StoreExpense]:
        query = select(self.model).where(
            self.model.store_id == store_id,
            self.model.period_month == month,
            self.model.period_year == year
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

class InventorySyncRepository(BaseRepository[InventorySyncLog]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(InventorySyncLog, session, current_user)

    async def get_latest_logs(self, limit: int = 20) -> List[InventorySyncLog]:
        query = select(self.model).order_by(self.model.timestamp.desc()).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ShiftRepository(BaseRepository[StaffShift]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(StaffShift, session, current_user)

    async def get_by_staff(self, staff_id: str) -> List[StaffShift]:
        query = select(self.model).where(self.model.staff_id == staff_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_store_shifts(self, store_id: str) -> List[StaffShift]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class RepairRepository(BaseRepository[RepairRequest]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(RepairRequest, session, current_user)

    async def get_by_customer(self, customer_id: str) -> List[RepairRequest]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class BookingRepository(BaseRepository[FittingRoomBooking]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FittingRoomBooking, session, current_user)

    async def get_by_store(self, store_id: str) -> List[FittingRoomBooking]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class StoreInventoryRepository(BaseRepository[StoreInventory]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(StoreInventory, session, current_user)

    async def get_store_stock(self, store_id: str) -> List[StoreInventory]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class POSRepository(BaseRepository[POSTransaction]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(POSTransaction, session, current_user)

class ClientelingRepository(BaseRepository[CustomerClienteling]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CustomerClienteling, session, current_user)
