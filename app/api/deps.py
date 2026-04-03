from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from enum import Enum
from app.db.session import async_session_factory as SessionLocal, engine as main_engine
from app.core import security
from app.core.config import settings
from app.api.schemas.user import TokenPayload
from app.db.models.base import User

class UserRole(str, Enum):
    PLATFORM_ADMIN = "platform_admin"
    BRAND_ADMIN = "brand_admin"
    BRAND_MANAGER = "brand_manager"
    SALES_REP = "sales_rep"
    BUYER_ADMIN = "buyer_admin"
    BUYER = "buyer"
    MERCHANDISER = "merchandiser"
    PLANNER = "planner"
    FINANCE_USER = "finance_user"
    ANALYST = "analyst"
    DISTRIBUTOR = "distributor"
    STORE_MANAGER = "store_manager"

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

async def get_db() -> Generator:
    # Use transactional block for safety
    async with SessionLocal() as session:
        yield session

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    # Updated mock to use token data:
    user = User(
        id=token_data.sub, 
        email=token_data.sub or "test@example.com", 
        role=token_data.role or UserRole.BRAND_ADMIN,
        organization_id=token_data.org_id or "test_org_1",
        full_name=token_data.sub.split('@')[0].replace('_', ' ').title() if token_data.sub else "Test User",
        is_active=True
    )
    # Ensure user is attached to session if needed, but for mock it's usually fine.
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user

def check_permissions(required_roles: List[str]):
    async def decorator(current_user: User = Depends(get_current_active_user)):
        if current_user.role == UserRole.PLATFORM_ADMIN:
            return current_user
        if current_user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Role {current_user.role} not authorized. Required: {required_roles}"
            )
        return current_user
    return decorator
