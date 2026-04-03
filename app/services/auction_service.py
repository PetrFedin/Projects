"""Auction service."""

from app.core.datetime_util import utc_now
from typing import List, Optional, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.models.auction import Auction, AuctionLot, AuctionBid
from app.db.repositories.auction import AuctionRepository, AuctionLotRepository, AuctionBidRepository
from app.db.models.base import User


class AuctionService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.auction_repo = AuctionRepository(db, current_user)
        self.lot_repo = AuctionLotRepository(db, current_user)
        self.bid_repo = AuctionBidRepository(db, current_user)

    async def create_auction(self, data: Dict[str, Any]) -> Auction:
        auction = Auction(
            organization_id=self.current_user.organization_id or "",
            brand_id=data.get("brand_id"),
            factory_id=data.get("factory_id"),
            title=data["title"],
            description=data.get("description"),
            auction_type=data.get("auction_type", "samples"),
            starts_at=data.get("starts_at"),
            ends_at=data.get("ends_at"),
        )
        return await self.auction_repo.create(auction)

    async def get_auction(self, auction_id: int) -> Optional[Auction]:
        return await self.auction_repo.get(auction_id)

    async def list_auctions(
        self,
        brand_id: Optional[str] = None,
        factory_id: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Auction]:
        if brand_id:
            return await self.auction_repo.get_by_brand(brand_id)
        if factory_id:
            return await self.auction_repo.get_by_factory(factory_id)
        if status == "active":
            return await self.auction_repo.get_active()
        return await self.auction_repo.get_all()

    async def update_auction(self, auction_id: int, data: Dict[str, Any]) -> Optional[Auction]:
        return await self.auction_repo.update(auction_id, **{k: v for k, v in data.items() if v is not None})

    async def add_lot(self, auction_id: int, data: Dict[str, Any]) -> AuctionLot:
        lot = AuctionLot(
            auction_id=auction_id,
            sku_id=data.get("sku_id"),
            batch_id=data.get("batch_id"),
            title=data["title"],
            description=data.get("description"),
            quantity=data.get("quantity", 1),
            start_price=data.get("start_price", 0.0),
            current_price=data.get("start_price", 0.0),
            reserve_price=data.get("reserve_price"),
            min_increment=data.get("min_increment", 1.0),
        )
        return await self.lot_repo.create(lot)

    async def get_lots(self, auction_id: int) -> List[AuctionLot]:
        return await self.lot_repo.get_by_auction(auction_id)

    async def place_bid(self, lot_id: int, amount: float) -> Optional[AuctionBid]:
        lot = await self.lot_repo.get(lot_id)
        if not lot or lot.status != "active":
            return None

        highest = await self.bid_repo.get_highest_for_lot(lot_id)
        min_bid = (highest.amount + lot.min_increment) if highest else lot.start_price
        if amount < min_bid:
            return None

        bid = AuctionBid(
            lot_id=lot_id,
            organization_id=self.current_user.organization_id or "",
            user_id=self.current_user.id,
            amount=amount,
        )
        created = await self.bid_repo.create(bid)

        # Update lot current price
        await self.lot_repo.update(lot_id, current_price=amount)
        return created

    async def close_lot(self, lot_id: int) -> Optional[AuctionLot]:
        from sqlalchemy import update
        highest = await self.bid_repo.get_highest_for_lot(lot_id)
        if not highest:
            return await self.lot_repo.update(lot_id, status="unsold", sold_at=utc_now())

        await self.db.execute(update(AuctionBid).where(AuctionBid.id == highest.id).values(is_winner=True))
        await self.db.commit()

        return await self.lot_repo.update(
            lot_id,
            status="sold",
            winner_org_id=highest.organization_id,
            sold_at=utc_now(),
            current_price=highest.amount,
        )

    async def get_bids(self, lot_id: int) -> List[AuctionBid]:
        return await self.bid_repo.get_by_lot(lot_id)
