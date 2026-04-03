from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
# Correcting model name based on what was added to base.py: AuditTrail
from app.db.repositories.base import BaseRepository
from app.db.models.base import AuditTrail

class AuditRepository(BaseRepository[AuditTrail]):
    def __init__(self, session: AsyncSession):
        super().__init__(AuditTrail, session)

    async def get_by_entity(self, entity_type: str, entity_id: str) -> List[AuditTrail]:
        query = select(self.model).where(
            self.model.entity_type == entity_type,
            self.model.entity_id == entity_id
        ).order_by(self.model.created_at.desc())
        result = await self.session.execute(query)
        return list(result.scalars().all())
