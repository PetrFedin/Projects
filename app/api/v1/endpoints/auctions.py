"""Auction API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.api.schemas.auction import (
    AuctionCreate, AuctionUpdate, AuctionSchema,
    LotCreate, LotSchema,
    BidCreate, BidSchema,
)
from app.services.auction_service import AuctionService

router = APIRouter()


@router.post("/", response_model=GenericResponse[AuctionSchema])
async def create_auction(
    data: AuctionCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Create a new auction."""
    service = AuctionService(db, current_user)
    auction = await service.create_auction(data.model_dump())
    return GenericResponse(data=AuctionSchema.model_validate(auction))


@router.get("/", response_model=GenericResponse[List[AuctionSchema]])
async def list_auctions(
    brand_id: Optional[str] = Query(None),
    factory_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """List auctions. Filter by brand_id, factory_id, or status=active."""
    service = AuctionService(db, current_user)
    auctions = await service.list_auctions(brand_id=brand_id, factory_id=factory_id, status=status)
    return GenericResponse(data=[AuctionSchema.model_validate(a) for a in auctions])


@router.get("/{auction_id}", response_model=GenericResponse[AuctionSchema])
async def get_auction(
    auction_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Get auction by ID."""
    service = AuctionService(db, current_user)
    auction = await service.get_auction(auction_id)
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return GenericResponse(data=AuctionSchema.model_validate(auction))


@router.patch("/{auction_id}", response_model=GenericResponse[AuctionSchema])
async def update_auction(
    auction_id: int,
    data: AuctionUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Update auction."""
    service = AuctionService(db, current_user)
    auction = await service.update_auction(auction_id, data.model_dump(exclude_unset=True))
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")
    return GenericResponse(data=AuctionSchema.model_validate(auction))


@router.post("/{auction_id}/lots", response_model=GenericResponse[LotSchema])
async def add_lot(
    auction_id: int,
    data: LotCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Add lot to auction."""
    service = AuctionService(db, current_user)
    lot = await service.add_lot(auction_id, data.model_dump())
    return GenericResponse(data=LotSchema.model_validate(lot))


@router.get("/{auction_id}/lots", response_model=GenericResponse[List[LotSchema]])
async def get_lots(
    auction_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Get all lots in auction."""
    service = AuctionService(db, current_user)
    lots = await service.get_lots(auction_id)
    return GenericResponse(data=[LotSchema.model_validate(l) for l in lots])


@router.post("/lots/{lot_id}/bids", response_model=GenericResponse[BidSchema])
async def place_bid(
    lot_id: int,
    data: BidCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Place bid on lot."""
    service = AuctionService(db, current_user)
    bid = await service.place_bid(lot_id, data.amount)
    if not bid:
        raise HTTPException(status_code=400, detail="Invalid bid (lot not active or amount too low)")
    return GenericResponse(data=BidSchema.model_validate(bid))


@router.get("/lots/{lot_id}/bids", response_model=GenericResponse[List[BidSchema]])
async def get_bids(
    lot_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Get bids for lot."""
    service = AuctionService(db, current_user)
    bids = await service.get_bids(lot_id)
    return GenericResponse(data=[BidSchema.model_validate(b) for b in bids])


@router.post("/lots/{lot_id}/close", response_model=GenericResponse[LotSchema])
async def close_lot(
    lot_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db),
):
    """Close lot and determine winner."""
    service = AuctionService(db, current_user)
    lot = await service.close_lot(lot_id)
    if not lot:
        raise HTTPException(status_code=404, detail="Lot not found")
    return GenericResponse(data=LotSchema.model_validate(lot))
