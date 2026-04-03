"""Central MVP guard: outbound integration calls require ENABLE_EXTERNAL_APIS."""

from typing import Any, Dict

from app.core.config import settings


def integration_ready(credentials_configured: bool) -> bool:
    """True only when external APIs are allowed and credentials are set."""
    return bool(settings.ENABLE_EXTERNAL_APIS and credentials_configured)


def integration_idle_response() -> Dict[str, Any]:
    """Status payload when an integration is not actively called (MVP off or missing creds)."""
    if not settings.ENABLE_EXTERNAL_APIS:
        return {"status": "disabled_mvp"}
    return {"status": "not_configured"}
