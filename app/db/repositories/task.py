from app.db.repositories.base import BaseRepository
from app.db.models.base import Task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

class TaskRepository(BaseRepository[Task]):
    def __init__(self, session: AsyncSession):
        super().__init__(Task, session)

    async def get_by_task_id(self, task_id: str) -> Optional[Task]:
        query = select(self.model).where(self.model.task_id == task_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
