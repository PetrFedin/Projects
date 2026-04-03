from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.api import deps
from app.db.repositories.marketing_crm import MarketingCRMRepository, InfluencerCampaignRepository, SEOCopyRepository, InfluencerItemRepository, PRSampleRepository
from app.api.schemas.marketing_crm import (
    Influencer, InfluencerCreate, InfluencerCampaign, InfluencerCampaignCreate,
    SEOCopy, SEOCopyCreate, InfluencerItemTrack, InfluencerItemCreate, PRSampleReturn, PRSampleCreate
)
from app.db.models.base import (
    Influencer as InfluencerModel,
    InfluencerCampaign as CampaignModel,
    SEOCopy as SEOModel,
    InfluencerItemTrack as ItemTrackModel,
    PRSampleReturn as PRSampleModel
)

router = APIRouter()

@router.get("/influencers", response_model=List[Influencer])
async def get_all_influencers(
    limit: int = 100,
    skip: int = 0,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MarketingCRMRepository(db, current_user=current_user)
    items = await repo.get_all(skip=skip, limit=limit)
    return items

@router.post("/influencers", response_model=Influencer)
async def create_influencer(
    influencer_in: InfluencerCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MarketingCRMRepository(db, current_user=current_user)
    new_influencer = InfluencerModel(**influencer_in.model_dump())
    return await repo.create(new_influencer)

@router.get("/influencers/{handle}", response_model=Optional[Influencer])
async def get_influencer(
    handle: str, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = MarketingCRMRepository(db, current_user=current_user)
    return await repo.get_by_handle(handle)

@router.get("/campaigns/{brand_id}", response_model=List[InfluencerCampaign])
async def get_brand_campaigns(
    brand_id: str,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InfluencerCampaignRepository(db, current_user=current_user)
    items = await repo.get_by_brand(brand_id)
    return items[:limit]

@router.post("/campaigns", response_model=InfluencerCampaign)
async def create_campaign(
    campaign_in: InfluencerCampaignCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InfluencerCampaignRepository(db, current_user=current_user)
    new_campaign = CampaignModel(**campaign_in.model_dump())
    return await repo.create(new_campaign)

@router.get("/seo/{sku_id}", response_model=List[SEOCopy])
async def get_sku_seo(
    sku_id: str,
    limit: int = 20,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SEOCopyRepository(db, current_user=current_user)
    items = await repo.get_by_sku(sku_id)
    return items[:limit]

@router.post("/seo", response_model=SEOCopy)
async def submit_seo_copy(
    seo_in: SEOCopyCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = SEOCopyRepository(db, current_user=current_user)
    new_seo = SEOModel(**seo_in.model_dump())
    return await repo.create(new_seo)

@router.get("/items/{influencer_id}", response_model=List[InfluencerItemTrack])
async def get_influencer_items(
    influencer_id: int,
    limit: int = 50,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InfluencerItemRepository(db, current_user=current_user)
    items = await repo.get_by_influencer(influencer_id)
    return items[:limit]

@router.post("/items", response_model=InfluencerItemTrack)
async def track_influencer_item(
    item_in: InfluencerItemCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InfluencerItemRepository(db, current_user=current_user)
    new_item = ItemTrackModel(**item_in.model_dump())
    return await repo.create(new_item)

@router.get("/pr-samples/{sku_id}", response_model=List[PRSampleReturn])
async def get_pr_samples(
    sku_id: str,
    limit: int = 20,
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = PRSampleRepository(db, current_user=current_user)
    items = await repo.get_by_sku(sku_id)
    return items[:limit]

@router.post("/pr-samples", response_model=PRSampleReturn)
async def report_pr_sample(
    sample_in: PRSampleCreate, 
    current_user=Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = PRSampleRepository(db, current_user=current_user)
    new_sample = PRSampleModel(**sample_in.model_dump())
    return await repo.create(new_sample)
