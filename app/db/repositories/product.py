from typing import List, Optional, Any
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    FeatureProposal, GradingChart, Product3DAsset, SampleOrder, 
    ConstructionDetail, DigitalSwatch, ProductLCA, CollectionDrop, 
    FitCorrection, ColorStory, MerchandiseGrid, 
    WardrobeItem, BodyScan, UserWallet, WalletTransaction, User,
    DigitalProductPassport, SustainabilityProof
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class ProductRepository(BaseRepository[FeatureProposal]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FeatureProposal, session, current_user)

class WardrobeRepository(BaseRepository[WardrobeItem]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(WardrobeItem, session, current_user)

class BodyScanRepository(BaseRepository[BodyScan]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(BodyScan, session, current_user)

class WalletRepository(BaseRepository[UserWallet]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(UserWallet, session, current_user)

class WalletTransactionRepository(BaseRepository[WalletTransaction]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(WalletTransaction, session, current_user)

class GradingRepository(BaseRepository[GradingChart]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(GradingChart, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[GradingChart]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class Asset3DRepository(BaseRepository[Product3DAsset]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Product3DAsset, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[Product3DAsset]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class SampleRepository(BaseRepository[SampleOrder]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SampleOrder, session, current_user)

    async def get_by_sku(self, sku_id: str) -> List[SampleOrder]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ConstructionRepository(BaseRepository[ConstructionDetail]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ConstructionDetail, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[ConstructionDetail]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class SwatchRepository(BaseRepository[DigitalSwatch]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(DigitalSwatch, session, current_user)

    async def get_by_material(self, material_name: str) -> Optional[DigitalSwatch]:
        query = select(self.model).where(self.model.material_name == material_name)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class LCARepository(BaseRepository[ProductLCA]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ProductLCA, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[ProductLCA]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class DropRepository(BaseRepository[CollectionDrop]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CollectionDrop, session, current_user)

    async def get_by_brand(self, brand_id: str, season: Optional[str] = None) -> List[CollectionDrop]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        if season:
            query = query.where(self.model.season == season)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.brand_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class FitCorrectionRepository(BaseRepository[FitCorrection]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(FitCorrection, session, current_user)

    async def get_by_sku(self, sku_id: str) -> List[FitCorrection]:
        query = select(self.model).where(self.model.sku_id == sku_id).order_by(self.model.created_at.desc())
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ColorStoryRepository(BaseRepository[ColorStory]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(ColorStory, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[ColorStory]:
        query = select(self.model).where(self.model.brand_id == brand_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class MerchandiseGridRepository(BaseRepository[MerchandiseGrid]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MerchandiseGrid, session, current_user)

    async def get_by_brand_and_season(self, brand_id: str, season: str) -> Optional[MerchandiseGrid]:
        query = select(self.model).where(
            self.model.brand_id == brand_id,
            self.model.season == season
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class PassportRepository(BaseRepository[DigitalProductPassport]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(DigitalProductPassport, session, current_user)

    async def get_by_sku(self, sku_id: str) -> Optional[DigitalProductPassport]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_uid(self, passport_uid: str) -> Optional[DigitalProductPassport]:
        query = select(self.model).where(self.model.passport_uid == passport_uid)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class SustainabilityProofRepository(BaseRepository[SustainabilityProof]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SustainabilityProof, session, current_user)

    async def get_by_entity(self, entity_type: str, entity_id: str) -> List[SustainabilityProof]:
        query = select(self.model).where(
            self.model.entity_type == entity_type,
            self.model.entity_id == entity_id
        ).order_by(self.model.timestamp.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())
