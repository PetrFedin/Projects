from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.intelligence import AssetRepository
from app.db.models.base import BrandAsset, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now

class BrandAssetService:
    """
    Service for Brand Assets: Press Kits, Lookbooks, and Logos.
    Vertical link: Press Kit tab in Brand Profile.
    Horizontal link: Used in Marketing Campaigns and B2B Showrooms.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = AssetRepository(db, current_user=current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_assets(self, is_public_only: bool = True) -> List[BrandAsset]:
        # Simple implementation for now
        all_assets = await self.repo.get_all()
        if is_public_only:
            return [a for a in all_assets if a.is_public]
        return all_assets

    async def add_asset(self, asset_type: str, title: str, file_url: str, is_public: bool = True) -> BrandAsset:
        new_asset = BrandAsset(
            organization_id=self.current_user.organization_id,
            asset_type=asset_type,
            title=title,
            file_url=file_url,
            is_public=is_public,
            created_at=utc_now()
        )
        asset = await self.repo.create(new_asset)
        
        # Horizontal Integration: Trigger event for new lookbook
        if asset_type == "lookbook":
            await self.rule_engine.trigger_event("marketing.asset_ready", {
                "module": "marketing",
                "id": asset.id,
                "title": title
            })
            
        return asset
