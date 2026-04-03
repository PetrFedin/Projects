from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import BOPISOrder, SupplyChainBottleneck, PackingList, LabelData, CustomsDeclaration, EACCertificate, TradeComplianceLog

class BOPISRepository(BaseRepository[BOPISOrder]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(BOPISOrder, session, current_user)

    async def get_by_order_id(self, order_id: str) -> Optional[BOPISOrder]:
        query = select(self.model).where(self.model.order_id == order_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_store(self, store_id: str) -> List[BOPISOrder]:
        query = select(self.model).where(self.model.store_id == store_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_pickup_code(self, pickup_code: str) -> Optional[BOPISOrder]:
        query = select(self.model).where(self.model.pickup_code == pickup_code)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class BottleneckRepository(BaseRepository[SupplyChainBottleneck]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SupplyChainBottleneck, session, current_user)

    async def get_active(self) -> List[SupplyChainBottleneck]:
        query = select(self.model).where(self.model.is_active == True).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class PackingRepository(BaseRepository[PackingList]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(PackingList, session, current_user)

    async def get_by_order(self, order_id: str) -> List[PackingList]:
        query = select(self.model).where(self.model.order_id == order_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class LabelRepository(BaseRepository[LabelData]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(LabelData, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[LabelData]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class CustomsRepository(BaseRepository[CustomsDeclaration]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CustomsDeclaration, session, current_user)

    async def get_by_order(self, order_id: str) -> Optional[CustomsDeclaration]:
        query = select(self.model).where(self.model.order_id == order_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class CertificateRepository(BaseRepository[EACCertificate]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(EACCertificate, session, current_user)

    async def get_by_number(self, certificate_number: str) -> Optional[EACCertificate]:
        query = select(self.model).where(self.model.certificate_number == certificate_number)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class ComplianceRepository(BaseRepository[TradeComplianceLog]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(TradeComplianceLog, session, current_user)

    async def get_by_partner(self, partner_id: str) -> List[TradeComplianceLog]:
        query = select(self.model).where(self.model.partner_id == partner_id).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())
