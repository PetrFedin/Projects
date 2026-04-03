from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import ContentGeneration, ColorStory, UGCPost

class MarketingRepository(BaseRepository[ContentGeneration]):
    def __init__(self, session: AsyncSession):
        super().__init__(ContentGeneration, session)

    async def get_by_sku(self, sku_id: str) -> List[ContentGeneration]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_platform(self, platform: str) -> List[ContentGeneration]:
        query = select(self.model).where(self.model.platform == platform)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ColorStoryRepository(BaseRepository[ColorStory]):
    def __init__(self, session: AsyncSession):
        super().__init__(ColorStory, session)

    async def get_by_brand(self, brand_id: str) -> List[ColorStory]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_collection(self, collection_name: str) -> Optional[ColorStory]:
        query = select(self.model).where(self.model.collection_name == collection_name)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class UGCRepository(BaseRepository[UGCPost]):
    def __init__(self, session: AsyncSession):
        super().__init__(UGCPost, session)

    async def get_by_sku(self, sku_id: str) -> List[UGCPost]:
        query = select(self.model).where(self.model.sku_id == sku_id, self.model.status == "approved")
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_pending(self) -> List[UGCPost]:
        query = select(self.model).where(self.model.status == "pending")
        result = await self.session.execute(query)
        return list(result.scalars().all())
