"""Shared auth helpers — DB-backed with dev mock fallback for tests."""

from __future__ import annotations

from app.api import deps
from app.core.config import settings


def resolve_mock_role_org(username: str) -> tuple[deps.UserRole, str]:
    role = deps.UserRole.BRAND_ADMIN
    org_id = "test_org_1"
    if "buyer" in username:
        role = deps.UserRole.BUYER
        org_id = "buyer_org_1"
    elif "brand_admin" in username:
        role = deps.UserRole.BRAND_ADMIN
        org_id = "test_org_1"
    elif "admin" in username:
        role = deps.UserRole.PLATFORM_ADMIN
        org_id = "org-hq-001"
    elif "brand" in username:
        role = deps.UserRole.BRAND_ADMIN
        org_id = "brand_org_1" if "synth1" in username else "org-brand-001"
    elif "merchandiser" in username:
        role = deps.UserRole.MERCHANDISER
        org_id = "test_org_1"
    elif "sales" in username:
        role = deps.UserRole.SALES_REP
        org_id = "test_org_1"
    elif "manufacturer" in username or "factory" in username:
        role = deps.UserRole.BRAND_MANAGER
        org_id = "factory_org_1"
    elif "supplier" in username:
        role = deps.UserRole.DISTRIBUTOR
        org_id = "supplier_org_1"
    return role, org_id


def should_use_db_auth() -> bool:
    return bool(settings.AUTH_USE_DB)
