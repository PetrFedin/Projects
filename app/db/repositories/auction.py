"""Auction repositories."""

from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.db.models.auction import Auction, AuctionLot, AuctionBid


class AuctionRepository(BaseRepository[Auction]):
    def __init__(self, session: AsyncSession, current_user=None):
        super().__init__(Auction, session, current_user)

    async def get_by_brand(self, brand_id: str) -> List[Auction]:
        query = select(Auction).where(Auction.brand_id == brand_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(Auction.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_factory(self, factory_id: str) -> List[Auction]:
        query = select(Auction).where(Auction.factory_id == factory_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(Auction.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_active(self) -> List[Auction]:
        query = select(Auction).where(Auction.status == "active")
        result = await self.session.execute(query)
        return list(result.scalars().all())


class AuctionLotRepository(BaseRepository[AuctionLot]):
    def __init__(self, session: AsyncSession, current_user=None):
        super().__init__(AuctionLot, session, current_user)

    async def get_by_auction(self, auction_id: int) -> List[AuctionLot]:
        query = select(AuctionLot).where(AuctionLot.auction_id == auction_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())


class AuctionBidRepository(BaseRepository[AuctionBid]):
    def __init__(self, session: AsyncSession, current_user=None):
        super().__init__(AuctionBid, session, current_user)

    async def get_by_lot(self, lot_id: int) -> List[AuctionBid]:
        query = select(AuctionBid).where(AuctionBid.lot_id == lot_id).order_by(AuctionBid.amount.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_highest_for_lot(self, lot_id: int) -> Optional[AuctionBid]:
        bids = await self.get_by_lot(lot_id)
        return bids[0] if bids else None
