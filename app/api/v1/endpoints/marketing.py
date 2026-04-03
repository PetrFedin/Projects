from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.marketing_service import MarketingService
from pydantic import BaseModel

router = APIRouter()

class CampaignRequest(BaseModel):
    prompt: str

class ContentRequest(BaseModel):
    sku_id: str
    platform: str # instagram, tiktok, shopify, amazon

@router.post("/campaigns/concept", response_model=Dict[str, Any])
async def generate_concept(
    data: CampaignRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Generates AI-driven campaign concepts and strategies."""
    service = MarketingService(db, current_user)
    return await service.generate_campaign_concept(data.prompt)

@router.post("/content/generate", response_model=Dict[str, Any])
async def generate_content(
    data: ContentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """AI Content Factory: Generates SEO and social media copy for a product."""
    service = MarketingService(db, current_user)
    content = await service.generate_product_content(data.sku_id, data.platform)
    return {
        "id": content.id,
        "sku_id": content.sku_id,
        "platform": content.platform,
        "generated_text": content.generated_text,
        "status": content.status
    }

@router.get("/campaigns/{campaign_id}/performance", response_model=Dict[str, Any])
async def get_performance(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Returns analytics for a specific marketing campaign."""
    service = MarketingService(db, current_user)
    return await service.get_campaign_performance(campaign_id)
