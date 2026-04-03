from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.product import (
    DropRepository, ColorStoryRepository, MerchandiseGridRepository
)
from app.db.models.base import CollectionDrop, ColorStory, MerchandiseGrid, User
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger

class CollectionService:
    """
    Service for managing collection lifecycle: drops, color stories, and merchandise grids.
    Horizontal integration: Connected to AI Rule Engine for drop delay alerts.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)
        self.drop_repo = DropRepository(db, current_user=current_user)
        self.color_repo = ColorStoryRepository(db, current_user=current_user)
        self.grid_repo = MerchandiseGridRepository(db, current_user=current_user)

    # --- Collection Drops ---
    async def get_drops(
        self,
        season: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 100,
    ) -> List[CollectionDrop]:
        drops = await self.drop_repo.get_by_brand(self.current_user.organization_id, season)
        if status:
            drops = [d for d in drops if d.status == status]
        return drops[:limit]

    async def create_drop(self, data: Dict[str, Any]) -> CollectionDrop:
        data["brand_id"] = self.current_user.organization_id
        new_drop = CollectionDrop(**data)
        drop = await self.drop_repo.create(new_drop)
        
        # Horizontal Integration: Trigger event for late drops
        await self.rule_engine.trigger_event("collection.drop_created", {
            "module": "collection",
            "id": drop.id,
            "status": drop.status,
            "scheduled_date": drop.scheduled_date.isoformat() if drop.scheduled_date else None
        })
        
        return drop

    # --- Color Stories ---
    async def get_color_stories(self, limit: int = 100) -> List[ColorStory]:
        stories = await self.color_repo.get_by_brand(self.current_user.organization_id)
        return stories[:limit]

    async def create_color_story(self, data: Dict[str, Any]) -> ColorStory:
        data["brand_id"] = self.current_user.organization_id
        new_story = ColorStory(**data)
        return await self.color_repo.create(new_story)

    # --- Merchandise Grids ---
    async def get_merchandise_grid(self, season: str) -> Optional[MerchandiseGrid]:
        return await self.grid_repo.get_by_brand_and_season(self.current_user.organization_id, season)

    async def save_merchandise_grid(self, season: str, data: Dict[str, Any]) -> MerchandiseGrid:
        existing = await self.grid_repo.get_by_brand_and_season(self.current_user.organization_id, season)
        if existing:
            # Update
            for key, value in data.items():
                setattr(existing, key, value)
            await self.db.commit()
            await self.db.refresh(existing)
            return existing
        else:
            # Create
            data["brand_id"] = self.current_user.organization_id
            data["season"] = season
            new_grid = MerchandiseGrid(**data)
            return await self.grid_repo.create(new_grid)
