from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import Base, User

ModelType = TypeVar("TypeVarModel", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession, current_user: Optional[User] = None):
        self.model = model
        self.session = session
        self.current_user = current_user

    async def count(self) -> int:
        from sqlalchemy import func
        query = select(func.count(self.model.id))
        # Apply tenant filter
        if self.current_user and hasattr(self.model, "organization_id") and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar() or 0

    async def get(self, id: Any) -> Optional[ModelType]:
        query = select(self.model).where(self.model.id == id)
        # Apply tenant filter if user is provided and model has organization_id
        if self.current_user and hasattr(self.model, "organization_id") and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        query = select(self.model).offset(skip).limit(limit)
        # Apply tenant filter if user is provided and model has organization_id
        if self.current_user and hasattr(self.model, "organization_id") and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create(self, obj_in: ModelType) -> ModelType:
        # Automatically set organization_id from user if missing
        if self.current_user and hasattr(obj_in, "organization_id") and not getattr(obj_in, "organization_id"):
            setattr(obj_in, "organization_id", self.current_user.organization_id)
            
        self.session.add(obj_in)
        await self.session.commit()
        await self.session.refresh(obj_in)
        return obj_in

    async def update(self, id: Any, **kwargs) -> Optional[ModelType]:
        query = update(self.model).where(self.model.id == id)
        # Apply tenant filter
        if self.current_user and hasattr(self.model, "organization_id") and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
        
        query = query.values(**kwargs).returning(self.model)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def delete(self, id: Any) -> bool:
        query = delete(self.model).where(self.model.id == id)
        # Apply tenant filter
        if self.current_user and hasattr(self.model, "organization_id") and self.current_user.role != "platform_admin":
            query = query.where(self.model.organization_id == self.current_user.organization_id)
            
        await self.session.execute(query)
        await self.session.commit()
        return True
