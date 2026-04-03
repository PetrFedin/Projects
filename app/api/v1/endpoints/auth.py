from datetime import timedelta
from app.core.datetime_util import utc_now
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.api.schemas.user import Token, User, UserCreate
from app.core import security
from app.core.config import settings
from app.db.models.base import User as UserModel

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
async def login_access_token(
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    if settings.ENVIRONMENT != "test":
        from app.core.rate_limit import check_rate_limit
        client_ip = request.client.host if request.client else "unknown"
        if not check_rate_limit(f"auth:{client_ip}", settings.AUTH_RATE_LIMIT, settings.AUTH_RATE_WINDOW):
            raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    # A bit more sophisticated mock:
    # brand_admin@... -> role=brand_admin, org=test_org_1
    # buyer@...       -> role=buyer, org=buyer_org_1
    
    role = deps.UserRole.BRAND_ADMIN
    org_id = "test_org_1"
    
    if "buyer" in form_data.username:
        role = deps.UserRole.BUYER
        org_id = "buyer_org_1"
    elif "brand_admin" in form_data.username:
        role = deps.UserRole.BRAND_ADMIN
        org_id = "test_org_1"
    elif "admin" in form_data.username:
        role = deps.UserRole.PLATFORM_ADMIN
        org_id = "org-hq-001"
    elif "brand" in form_data.username:
        role = deps.UserRole.BRAND_ADMIN
        org_id = "brand_org_1" if "synth1" in form_data.username else "org-brand-001"
    elif "merchandiser" in form_data.username:
        role = deps.UserRole.MERCHANDISER
        org_id = "test_org_1"
    elif "sales" in form_data.username:
        role = deps.UserRole.SALES_REP
        org_id = "test_org_1"
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            subject=form_data.username, 
            expires_delta=access_token_expires,
            extra_claims={"role": role, "org_id": org_id}
        ),
        "token_type": "bearer",
    }

@router.post("/test-token", response_model=User)
async def test_token(current_user: UserModel = Depends(deps.get_current_user)) -> Any:
    return current_user

@router.post("/signup", response_model=User)
async def create_user_signup(
    *,
    db: AsyncSession = Depends(deps.get_db),
    password: str,
    email: str,
    full_name: str = None,
) -> Any:
    # Mock: real registration would persist to DB, hash password, send verification
    new_user = UserModel(
        id="new_user_id",
        email=email,
        hashed_password=security.get_password_hash(password),
        full_name=full_name,
        role="buyer",
        is_active=True,
        created_at=utc_now(),
        updated_at=utc_now()
    )
    return new_user
