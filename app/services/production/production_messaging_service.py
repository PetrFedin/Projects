"""Production messaging (entity-threaded)."""
from typing import List, Optional, Dict, Any
from app.core.datetime_util import utc_now
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User, ProductionMessage


class ProductionMessagingService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def get_production_messages(
        self,
        batch_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        q = select(ProductionMessage).order_by(ProductionMessage.created_at.desc()).limit(limit)
        if batch_id:
            q = q.where(ProductionMessage.batch_id == batch_id)
        if sku_id:
            q = q.where(ProductionMessage.sku_id == sku_id)
        if entity_type:
            q = q.where(ProductionMessage.entity_type == entity_type)
        if entity_id:
            q = q.where(ProductionMessage.entity_id == entity_id)
        res = await self.db.execute(q)
        msgs = res.scalars().all()
        return [
            {
                "id": m.id, "sender_id": m.sender_id, "sender_role": m.sender_role, "content": m.content,
                "batch_id": m.batch_id, "sku_id": m.sku_id, "entity_type": m.entity_type, "entity_id": m.entity_id,
                "created_at": m.created_at.isoformat()
            }
            for m in msgs
        ]

    async def send_production_message(
        self,
        text: str,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        sku_id: Optional[str] = None,
        batch_id: Optional[str] = None
    ) -> ProductionMessage:
        msg = ProductionMessage(
            entity_type=entity_type,
            entity_id=entity_id,
            sku_id=sku_id,
            batch_id=batch_id,
            sender_id=str(self.current_user.id),
            sender_role=str(self.current_user.role) if getattr(self.current_user, "role", None) else "user",
            content=text,
            created_at=utc_now()
        )
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return msg
