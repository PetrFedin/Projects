from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.base import User, Showroom, ShowroomItem
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from app.core.datetime_util import utc_now
from app.api.schemas.showroom import ShowroomCreate, ShowroomItemCreate

class ShowroomService:
    """
    Vertical service for Digital Showroom (Section SHOWROOMS).
    Links Brand (Collections) to Retailer/Distributor (Buying experience).
    Horizontal link: Asset creation -> Showroom update.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)

    async def get_all(self) -> List[Showroom]:
        """Returns showrooms: own org for brand, or public for buyer."""
        from sqlalchemy import or_
        if self.current_user.role in ("buyer", "buyer_admin", "store_manager"):
            query = select(Showroom).where(Showroom.is_public == True)
        else:
            query = select(Showroom).where(Showroom.organization_id == self.current_user.organization_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, showroom_id: int) -> Optional[Showroom]:
        """Returns a showroom by ID."""
        query = select(Showroom).where(Showroom.id == showroom_id)
        # Add org check if not platform admin
        if self.current_user.role != "platform_admin":
            query = query.where(Showroom.organization_id == self.current_user.organization_id)
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def create_showroom(self, data: ShowroomCreate) -> Showroom:
        """Creates a digital showroom."""
        new_showroom = Showroom(
            organization_id=self.current_user.organization_id,
            name=data.name,
            slug=data.slug,
            description=data.description,
            is_active=data.is_active,
            season_id=data.season_id,
            is_public=data.is_public,
            access_code=data.access_code,
            vr_url=data.vr_url,
            media_asset_id=data.media_asset_id,
            linesheet_id=data.linesheet_id,
            metadata_json=data.metadata_json,
            showroom_type=getattr(data, "showroom_type", "standard"),
            event_start_date=getattr(data, "event_start_date", None),
            event_end_date=getattr(data, "event_end_date", None),
            invite_only=getattr(data, "invite_only", False),
            created_at=utc_now()
        )
        self.db.add(new_showroom)
        await self.db.commit()
        await self.db.refresh(new_showroom)
        
        # Horizontal Integration: Notify Marketing to prepare assets
        await self.rule_engine.trigger_event("showroom.created", {
            "module": "showroom",
            "id": new_showroom.id,
            "organization_id": self.current_user.organization_id
        })
        return new_showroom

    async def add_item(self, showroom_id: int, item_data: ShowroomItemCreate) -> ShowroomItem:
        """Adds an item to a showroom."""
        # Check access
        showroom = await self.get_by_id(showroom_id)
        if not showroom:
            raise Exception("Showroom not found or access denied")

        new_item = ShowroomItem(
            showroom_id=showroom_id,
            product_name=item_data.product_name,
            sku=item_data.sku,
            brand_name=item_data.brand_name,
            color=item_data.color,
            size_range=item_data.size_range,
            wholesale_price=item_data.wholesale_price,
            currency=item_data.currency
        )
        self.db.add(new_item)
        await self.db.commit()
        await self.db.refresh(new_item)
        return new_item

    async def get_showroom_360_experience(self, showroom_id: str) -> Dict[str, Any]:
        """Returns the full 360/interactive experience metadata."""
        # Simulated data for high-end digital showroom
        return {
            "showroom_id": showroom_id,
            "theme": "Industrial Chic - Fall 25",
            "media": [
                {"type": "video_360", "url": "https://cdn.synth.io/showrooms/f25/main.mp4"},
                {"type": "hotspot", "sku": "SKU-TSH-WHT", "coords": [12, 45, 78]}
            ],
            "live_buyer_chat_active": True
        }

    async def add_visitor(self, showroom_id: str, organization_id: str):
        """Records a visitor to the showroom (Sales analytics)."""
        await self.rule_engine.trigger_event("showroom.visitor_detected", {
            "module": "showroom",
            "id": showroom_id,
            "visitor_org": organization_id
        })

    async def attach_asset(self, showroom_id: int, media_asset_id: int) -> Optional[Showroom]:
        """Attach DAM media asset to showroom. Returns updated showroom or None."""
        showroom = await self.get_by_id(showroom_id)
        if not showroom:
            return None
        from app.db.models.base import MediaAsset
        asset_res = await self.db.execute(select(MediaAsset).where(MediaAsset.id == media_asset_id))
        asset = asset_res.scalar_one_or_none()
        if not asset:
            return None
        showroom.media_asset_id = media_asset_id
        showroom.vr_url = asset.processed_url or asset.original_url
        showroom.updated_at = utc_now()
        await self.db.commit()
        await self.db.refresh(showroom)
        return showroom
