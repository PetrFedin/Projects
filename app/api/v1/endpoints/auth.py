from datetime import timedelta
import uuid
from typing import Any

from fastapi import APIRouter, Depends, Form, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.api.schemas.user import Token, User
from app.core import security
from app.core.config import settings
from app.core.datetime_util import utc_now
from app.db.models.base import User as UserModel
from app.db.repositories.user import UserRepository
from app.services.auth_service import resolve_mock_role_org, should_use_db_auth

router = APIRouter()


@router.post("/login/access-token", response_model=Token)
async def login_access_token(
    request: Request,
    db: AsyncSession = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Any:
    if settings.ENVIRONMENT != "test":
        from app.core.rate_limit import check_rate_limit

        client_ip = request.client.host if request.client else "unknown"
        if not check_rate_limit(
            f"auth:{client_ip}", settings.AUTH_RATE_LIMIT, settings.AUTH_RATE_WINDOW
        ):
            raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")

    user_repo = UserRepository(db)
    db_user = await user_repo.get_by_email(form_data.username)

    if db_user and should_use_db_auth():
        if not security.verify_password(form_data.password, db_user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        if not db_user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        subject = db_user.id
        extra = {"role": db_user.role, "org_id": db_user.organization_id or "test_org_1"}
    elif db_user:
        if security.verify_password(form_data.password, db_user.hashed_password):
            subject = db_user.id
            extra = {"role": db_user.role, "org_id": db_user.organization_id or "test_org_1"}
        else:
            role, org_id = resolve_mock_role_org(form_data.username)
            subject = form_data.username
            extra = {"role": role, "org_id": org_id}
    else:
        role, org_id = resolve_mock_role_org(form_data.username)
        subject = form_data.username
        extra = {"role": role, "org_id": org_id}

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            subject=subject,
            expires_delta=access_token_expires,
            extra_claims=extra,
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
    password: str = Form(...),
    email: str = Form(...),
    full_name: str | None = Form(None),
) -> Any:
    user_repo = UserRepository(db)
    existing = await user_repo.get_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    role, org_id = resolve_mock_role_org(email)
    created = await user_repo.create_user(
        user_id=user_id,
        email=email,
        hashed_password=security.get_password_hash(password),
        full_name=full_name,
        role=role.value if hasattr(role, "value") else str(role),
        organization_id=org_id,
    )
    return created


@router.post("/firebase/exchange", response_model=Token)
async def firebase_token_exchange(
    *,
    db: AsyncSession = Depends(deps.get_db),
    id_token: str = Form(...),
) -> Any:
    """Optional: verify Firebase ID token and issue platform JWT."""
    if not settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        raise HTTPException(
            status_code=501,
            detail="Firebase backend exchange not configured (FIREBASE_SERVICE_ACCOUNT_JSON)",
        )
    try:
        import firebase_admin
        from firebase_admin import auth as firebase_auth, credentials

        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
            firebase_admin.initialize_app(cred)
        decoded = firebase_auth.verify_id_token(id_token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {exc}") from exc

    email = decoded.get("email") or decoded.get("uid")
    user_repo = UserRepository(db)
    db_user = await user_repo.get_by_email(email)
    if not db_user:
        role, org_id = resolve_mock_role_org(email)
        db_user = await user_repo.create_user(
            user_id=decoded.get("uid") or str(uuid.uuid4()),
            email=email,
            hashed_password=security.get_password_hash(uuid.uuid4().hex),
            full_name=decoded.get("name"),
            role=role.value if hasattr(role, "value") else str(role),
            organization_id=org_id,
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            subject=db_user.id,
            expires_delta=access_token_expires,
            extra_claims={
                "role": db_user.role,
                "org_id": db_user.organization_id or "test_org_1",
            },
        ),
        "token_type": "bearer",
    }
