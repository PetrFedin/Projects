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
from app.core.datetime_util import utc_now

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
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token",
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

    from app.db.repositories.user import UserRepository
    from app.services.auth_service import resolve_mock_role_org

    user_repo = UserRepository(db)
    db_user = None
    if token_data.sub:
        db_user = await user_repo.get_by_id(token_data.sub)
        if not db_user:
            db_user = await user_repo.get_by_email(token_data.sub)

    if db_user:
        return db_user

    role_str = token_data.role or UserRole.BRAND_ADMIN
    if isinstance(role_str, str):
        try:
            role = UserRole(role_str)
        except ValueError:
            role = UserRole.BRAND_ADMIN
    else:
        role = role_str

    email = token_data.sub if "@" in (token_data.sub or "") else f"{token_data.sub}@example.com"
    now = utc_now()
    return User(
        id=token_data.sub or "mock-user",
        email=email,
        hashed_password="",
        role=role.value if hasattr(role, "value") else str(role),
        organization_id=token_data.org_id or resolve_mock_role_org(email)[1],
        full_name=(token_data.sub or "User").split("@")[0].replace("_", " ").title(),
        is_active=True,
        created_at=now,
        updated_at=now,
    )

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
