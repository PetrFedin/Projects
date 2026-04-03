from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import (
    B2BDiscount, MOQSetting, CreditLimit, SeasonalCredit, 
    WholesaleMessage, OrderLog, CreditMemo, WholesaleBNPL, DealerExclusivity,
    Linesheet, Quote, Assortment, User
)

class WholesaleRepository(BaseRepository[B2BDiscount]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(B2BDiscount, session, current_user)

    async def get_all_discounts(self) -> List[B2BDiscount]:
        query = select(self.model).order_by(self.model.min_volume.asc())
        if self.current_user and self.current_user.role != "platform_admin":
            # Discounts might be brand-specific in future
            pass
        result = await self.session.execute(query)
        return list(result.scalars().all())

class MOQRepository(BaseRepository[MOQSetting]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(MOQSetting, session, current_user)

    async def get_by_sku(self, sku_id: str, country_code: Optional[str] = None) -> Optional[MOQSetting]:
        query = select(self.model).where(self.model.sku_id == sku_id)
        if country_code:
            from sqlalchemy import or_
            query = query.where(or_(self.model.country_code == country_code, self.model.country_code.is_(None)))
        result = await self.session.execute(query)
        rows = result.scalars().all()
        if country_code and rows:
            for r in rows:
                if r.country_code == country_code:
                    return r
        return rows[0] if rows else None

class CreditLimitRepository(BaseRepository[CreditLimit]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CreditLimit, session, current_user)

    async def get_by_partner(self, partner_id: str) -> Optional[CreditLimit]:
        query = select(self.model).where(self.model.partner_id == partner_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class SeasonalCreditRepository(BaseRepository[SeasonalCredit]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(SeasonalCredit, session, current_user)

    async def get_by_partner_and_season(self, partner_id: str, season: str) -> List[SeasonalCredit]:
        query = select(self.model).where(self.model.partner_id == partner_id, self.model.season == season)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class MessageRepository(BaseRepository[WholesaleMessage]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(WholesaleMessage, session, current_user)

    async def get_order_messages(self, order_id: str) -> List[WholesaleMessage]:
        query = select(self.model).where(self.model.order_id == order_id).order_by(self.model.created_at.asc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class OrderLogRepository(BaseRepository[OrderLog]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(OrderLog, session, current_user)

    async def get_by_order(self, order_id: str) -> List[OrderLog]:
        query = select(self.model).where(self.model.order_id == order_id).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

class MemoRepository(BaseRepository[CreditMemo]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(CreditMemo, session, current_user)

    async def get_by_partner(self, partner_id: str) -> List[CreditMemo]:
        query = select(self.model).where(self.model.partner_id == partner_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class BNPLRepository(BaseRepository[WholesaleBNPL]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(WholesaleBNPL, session, current_user)

    async def get_by_partner(self, partner_id: str) -> List[WholesaleBNPL]:
        query = select(self.model).where(self.model.partner_id == partner_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class ExclusivityRepository(BaseRepository[DealerExclusivity]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(DealerExclusivity, session, current_user)

    async def get_by_partner(self, partner_id: str) -> Optional[DealerExclusivity]:
        query = select(self.model).where(self.model.partner_id == partner_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

class QuoteRepository(BaseRepository[Quote]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Quote, session, current_user)

    async def get_by_buyer(self, buyer_id: str) -> List[Quote]:
        query = select(Quote).where(Quote.buyer_id == buyer_id).order_by(Quote.created_at.desc())
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(Quote.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_organization(self) -> List[Quote]:
        if not self.current_user:
            return []
        query = select(Quote).where(Quote.organization_id == self.current_user.organization_id).order_by(Quote.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())


class LinesheetRepository(BaseRepository[Linesheet]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Linesheet, session, current_user)

    async def get_by_season(self, season: str) -> List[Linesheet]:
        query = select(self.model).where(self.model.season == season)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())


class AssortmentRepository(BaseRepository[Assortment]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Assortment, session, current_user)

    async def get_by_collection(self, collection_id: str) -> List[Assortment]:
        query = select(Assortment).where(Assortment.collection_id == collection_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(Assortment.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
