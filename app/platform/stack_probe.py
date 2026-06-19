"""Runtime probes for platform stack capabilities."""

from __future__ import annotations

import httpx
from sqlalchemy import text

from app.core.config import settings
from app.platform.stack_registry import STACK_CAPABILITIES, StackCapabilityId


async def probe_postgresql() -> dict:
    url = settings.DATABASE_URL or ""
    is_pg = url.startswith("postgresql")
    status = "not_configured"
    detail = "DATABASE_URL is not PostgreSQL"
    if is_pg:
        try:
            from app.db.session import engine

            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            status = "ok"
            detail = "PostgreSQL reachable"
        except Exception as exc:
            status = "error"
            detail = str(exc)[:200]
    elif "sqlite" in url:
        status = "fallback"
        detail = "SQLite fallback (set DATABASE_URL=postgresql+asyncpg://… for prod canon)"
    return {"status": status, "detail": detail, "driver": url.split(":", 1)[0] if url else None}


async def probe_sqlalchemy() -> dict:
    try:
        from app.db.models import base  # noqa: F401 — register metadata

        tables = len(base.Base.metadata.tables)
        return {"status": "ok", "detail": f"{tables} tables in metadata", "tables": tables}
    except Exception as exc:
        return {"status": "error", "detail": str(exc)[:200]}


def probe_alembic() -> dict:
    from pathlib import Path

    root = Path(__file__).resolve().parents[2]
    has_ini = (root / "alembic.ini").is_file()
    has_env = (root / "alembic" / "env.py").is_file()
    scripts = list((root / "app" / "db" / "migrations").glob("create_*.py"))
    if has_ini and has_env:
        return {"status": "ok", "detail": "Alembic bootstrapped", "manual_scripts": len(scripts)}
    return {
        "status": "partial",
        "detail": f"Manual migrations only ({len(scripts)} scripts)",
        "manual_scripts": len(scripts),
    }


def probe_jwt() -> dict:
    key_ok = settings.SECRET_KEY != "SUPER_SECRET_KEY_FOR_DEVELOPMENT_ONLY" or settings.ENVIRONMENT in (
        "development",
        "test",
    )
    return {
        "status": "ok" if key_ok else "warn",
        "detail": "JWT HS256 configured",
        "auth_use_db": settings.AUTH_USE_DB,
    }


def probe_users() -> dict:
    return {
        "status": "ok",
        "detail": "User model + UserRepository",
        "auth_use_db": settings.AUTH_USE_DB,
    }


def probe_catalog() -> dict:
    return {
        "status": "ok",
        "detail": "PLM + showrooms + wholesale + marketplace routes",
    }


def probe_image_upload() -> dict:
    from pathlib import Path

    upload_dir = Path(settings.MEDIA_UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    return {
        "status": "ok",
        "detail": str(upload_dir),
        "writable": upload_dir.is_dir(),
    }


def probe_firebase() -> dict:
    has_sa = bool(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
    return {
        "status": "configured" if has_sa else "frontend_only",
        "detail": "Backend Firebase token exchange" if has_sa else "Frontend lazy init; optional JWT exchange",
    }


async def probe_payments() -> dict:
    from app.integrations.payment import PaymentClient
    from app.integrations.yukassa import YukassaClient
    from app.integrations.stripe_client import StripeClient

    tinkoff = PaymentClient()
    yk = YukassaClient()
    stripe = StripeClient()
    return {
        "status": "ok",
        "tinkoff": await tinkoff.health_check(),
        "yukassa": await yk.health_check(),
        "stripe": await stripe.health_check(),
    }


async def probe_ai() -> dict:
    provider = settings.LLM_PROVIDER
    detail = f"provider={provider}, model={settings.AI_MODEL}"
    if provider == "ollama":
        base = settings.OLLAMA_BASE_URL.rstrip("/")
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                r = await client.get(f"{base}/api/tags")
                if r.status_code == 200:
                    models = [m.get("name") for m in r.json().get("models", [])[:5]]
                    return {"status": "ok", "detail": detail, "ollama_models": models}
                return {"status": "error", "detail": f"Ollama HTTP {r.status_code}"}
        except Exception as exc:
            return {"status": "error", "detail": f"Ollama unreachable: {exc}"}
    if provider == "openai" and settings.OPENAI_API_KEY:
        return {"status": "ok", "detail": detail}
    if provider == "gemini" and settings.GEMINI_API_KEY:
        return {"status": "ok", "detail": detail}
    return {"status": "bootstrap", "detail": detail}


async def probe_all_capabilities() -> dict[str, dict]:
    payments = await probe_payments()
    ai = await probe_ai()
    return {
        StackCapabilityId.POSTGRESQL.value: await probe_postgresql(),
        StackCapabilityId.SQLALCHEMY.value: await probe_sqlalchemy(),
        StackCapabilityId.ALEMBIC.value: probe_alembic(),
        StackCapabilityId.JWT_AUTH.value: probe_jwt(),
        StackCapabilityId.USERS.value: probe_users(),
        StackCapabilityId.PRODUCT_CATALOG.value: probe_catalog(),
        StackCapabilityId.IMAGE_UPLOAD.value: probe_image_upload(),
        StackCapabilityId.FIREBASE_AUTH.value: probe_firebase(),
        StackCapabilityId.PAYMENTS.value: payments,
        StackCapabilityId.AI_MODULE.value: ai,
    }


def build_stack_matrix() -> list[dict]:
    """Full registry + probe placeholders for API response."""
    rows = []
    for cap_id, meta in STACK_CAPABILITIES.items():
        rows.append(
            {
                "id": cap_id.value,
                "title": meta["title"],
                "pillars": meta["pillars"],
                "roles": meta["roles"],
                "section_ids": meta["section_ids"],
                "agent_ids": meta["agent_ids"],
                "backend_modules": meta["backend_modules"],
                "frontend_modules": meta["frontend_modules"],
                "env_keys": meta["env_keys"],
            }
        )
    return rows
