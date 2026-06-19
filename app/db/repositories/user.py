from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.core import User
from app.db.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession, current_user: Optional[User] = None):
        super().__init__(User, session, current_user)

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: str) -> Optional[User]:
        return await self.get(user_id)

    async def create_user(
        self,
        *,
        user_id: str,
        email: str,
        hashed_password: str,
        full_name: Optional[str] = None,
        role: str = "buyer",
        organization_id: Optional[str] = None,
    ) -> User:
        user = User(
            id=user_id,
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            role=role,
            organization_id=organization_id,
            is_active=True,
        )
        return await self.create(user)
