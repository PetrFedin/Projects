from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import Showroom, User

class ShowroomRepository(BaseRepository[Showroom]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Showroom, session, current_user)

    async def get_by_season(self, season_id: str) -> List[Showroom]:
        query = select(self.model).where(self.model.season_id == season_id)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_active_showrooms(self) -> List[Showroom]:
        query = select(self.model).where(self.model.is_public == True)
        if self.current_user and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())
