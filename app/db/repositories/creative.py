from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import Lookbook, StyleDNA, VideoConsultation, AIModelAsset, VirtualShowEvent, AIStudioAsset

class CreativeRepository(BaseRepository[Lookbook]):
    def __init__(self, session: AsyncSession):
        super().__init__(Lookbook, session)

    async def get_by_brand(self, brand_id: str) -> List[Lookbook]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_published(self, brand_id: Optional[str] = None) -> List[Lookbook]:
        query = select(self.model).where(self.model.is_published == True)
        if brand_id:
            query = query.where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class DNARepository(BaseRepository[StyleDNA]):
    def __init__(self, session: AsyncSession):
        super().__init__(StyleDNA, session)

    async def get_by_customer(self, customer_id: str) -> Optional[StyleDNA]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class ConsultationRepository(BaseRepository[VideoConsultation]):
    def __init__(self, session: AsyncSession):
        super().__init__(VideoConsultation, session)

    async def get_by_customer(self, customer_id: str) -> List[VideoConsultation]:
        query = select(self.model).where(self.model.customer_id == customer_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_stylist(self, stylist_id: str) -> List[VideoConsultation]:
        query = select(self.model).where(self.model.stylist_id == stylist_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class AIAssetRepository(BaseRepository[AIModelAsset]):
    def __init__(self, session: AsyncSession):
        super().__init__(AIModelAsset, session)

    async def get_by_lookbook(self, lookbook_id: int) -> List[AIModelAsset]:
        query = select(self.model).where(self.model.lookbook_id == lookbook_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class VirtualShowRepository(BaseRepository[VirtualShowEvent]):
    def __init__(self, session: AsyncSession):
        super().__init__(VirtualShowEvent, session)

    async def get_by_brand(self, brand_id: str) -> List[VirtualShowEvent]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.scheduled_at.asc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_upcoming(self) -> List[VirtualShowEvent]:
        query = select(self.model).where(self.model.status == "upcoming").order_by(self.model.scheduled_at.asc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class AIStudioRepository(BaseRepository[AIStudioAsset]):
    def __init__(self, session: AsyncSession):
        super().__init__(AIStudioAsset, session)

    async def get_by_brand(self, brand_id: str) -> List[AIStudioAsset]:
        query = select(self.model).where(self.model.brand_id == brand_id).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())
