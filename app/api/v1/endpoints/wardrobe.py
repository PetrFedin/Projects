from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_db
from app.db.repositories.wardrobe import WardrobeRepository, WishlistRepository, ReferralRepository, SubscriptionRepository
from app.api.schemas.wardrobe import (
    WardrobeItem, WardrobeItemCreate, SuggestOutfitRequest,
    WishlistGroup, WishlistGroupCreate,
    ReferralProgram, ReferralProgramCreate,
    BoxSubscription, BoxSubscriptionCreate
)
from app.agents.creative_agents import stylist_agent
from app.db.models.base import (
    WardrobeItem as WardrobeModel,
    WishlistGroup as WishlistModel,
    ReferralProgram as ReferralModel,
    BoxSubscription as SubscriptionModel
)

router = APIRouter()

@router.get("/{customer_id}", response_model=List[WardrobeItem])
async def get_customer_wardrobe(customer_id: str, db: AsyncSession = Depends(get_db)):
    repo = WardrobeRepository(db)
    return await repo.get_by_customer(customer_id)

@router.post("/items", response_model=WardrobeItem)
async def add_to_wardrobe(item_in: WardrobeItemCreate, db: AsyncSession = Depends(get_db)):
    repo = WardrobeRepository(db)
    new_item = WardrobeModel(**item_in.model_dump())
    return await repo.create(new_item)

@router.post("/suggest-outfit")
async def suggest_outfit(req: SuggestOutfitRequest, db: AsyncSession = Depends(get_db)):
    repo = WardrobeRepository(db)
    wardrobe = await repo.get_by_customer(req.customer_id)
    skus = [w.sku_id for w in wardrobe]
    
    # Run Stylist Agent
    context = {
        "occasion": req.occasion,
        "weather_context": req.weather_context,
        "wardrobe_skus": skus
    }
    result = await stylist_agent.run(req.customer_id, context=context)
    
    return {"recommendation": result.code_changes, "suggested_at": result.changes_proposed}

@router.get("/wishlist/{user_id}", response_model=List[WishlistGroup])
async def get_user_wishlists(user_id: str, db: AsyncSession = Depends(get_db)):
    repo = WishlistRepository(db)
    return await repo.get_by_user(user_id)

@router.post("/wishlist", response_model=WishlistGroup)
async def create_wishlist_group(req: WishlistGroupCreate, db: AsyncSession = Depends(get_db)):
    repo = WishlistRepository(db)
    new_wishlist = WishlistModel(**req.model_dump())
    return await repo.create(new_wishlist)

@router.get("/referral/{referrer_id}", response_model=List[ReferralProgram])
async def get_referrals(referrer_id: str, db: AsyncSession = Depends(get_db)):
    repo = ReferralRepository(db)
    return await repo.get_by_referrer(referrer_id)

@router.post("/referral", response_model=ReferralProgram)
async def create_referral(req: ReferralProgramCreate, db: AsyncSession = Depends(get_db)):
    repo = ReferralRepository(db)
    new_referral = ReferralModel(**req.model_dump())
    return await repo.create(new_referral)

@router.get("/subscriptions/{customer_id}", response_model=List[BoxSubscription])
async def get_customer_subscriptions(customer_id: str, db: AsyncSession = Depends(get_db)):
    repo = SubscriptionRepository(db)
    return await repo.get_by_customer(customer_id)

@router.post("/subscriptions", response_model=BoxSubscription)
async def create_subscription(req: BoxSubscriptionCreate, db: AsyncSession = Depends(get_db)):
    repo = SubscriptionRepository(db)
    new_sub = SubscriptionModel(**req.model_dump())
    return await repo.create(new_sub)
