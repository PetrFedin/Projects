from typing import List, Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import Supplier, MaterialOrder, LabDip, RFQ, RFQVendorQuote, RawMaterialTrace, SupplyChainTA, FactoryCapacityBooking, MaterialReservation, User

class SupplierRepository(BaseRepository[Supplier]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Supplier, session, current_user)

    async def get_by_type(self, supplier_type: str) -> List[Supplier]:
        query = select(self.model).where(self.model.supplier_type == supplier_type)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class MaterialOrderRepository(BaseRepository[MaterialOrder]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MaterialOrder, session, current_user)

    async def get_by_supplier(self, supplier_id: int) -> List[MaterialOrder]:
        query = select(self.model).where(self.model.supplier_id == supplier_id)
        if self.current_user and self.current_user.role != "platform_admin":
            # Assuming supplier link
            pass
        result = await self.session.execute(query)
        return list(result.scalars().all())

class LabDipRepository(BaseRepository[LabDip]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(LabDip, session, current_user)

class RFQRepository(BaseRepository[RFQ]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(RFQ, session, current_user)

class QuoteRepository(BaseRepository[RFQVendorQuote]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(RFQVendorQuote, session, current_user)

class TraceRepository(BaseRepository[RawMaterialTrace]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(RawMaterialTrace, session, current_user)

class TARepository(BaseRepository[SupplyChainTA]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SupplyChainTA, session, current_user)

class BookingRepository(BaseRepository[FactoryCapacityBooking]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FactoryCapacityBooking, session, current_user)

class ReservationRepository(BaseRepository[MaterialReservation]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MaterialReservation, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[MaterialReservation]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.created_at.desc())
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_material(self, material_id: str) -> List[MaterialReservation]:
        query = select(self.model).where(self.model.material_id == material_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
