from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.base import BaseRepository
from app.db.models.base import TeamTask, Notification, User

class TeamTaskRepository(BaseRepository[TeamTask]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(TeamTask, session, current_user=current_user)

    async def get_by_assignee(self, assignee_id: str) -> List[TeamTask]:
        query = select(self.model).where(self.model.assignee_id == assignee_id)
        if self.current_user:
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_context(self, context_type: str, context_id: str) -> List[TeamTask]:
        query = select(self.model).where(
            self.model.context_type == context_type,
            self.model.context_id == context_id
        )
        if self.current_user:
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(Notification, session, current_user=current_user)

    async def get_unread_for_user(self, user_id: str) -> List[Notification]:
        query = select(self.model).where(
            self.model.user_id == user_id,
            self.model.is_read == False
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())
