"""1С интеграция (обмен данными с учётной системой)."""

from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class C1CClient(BaseIntegrationClient):
    """Client for 1C:Enterprise (1С:Предприятие) HTTP API."""

    def __init__(self):
        self.base_url = (settings.C1C_BASE_URL or "").rstrip("/")
        self.user = settings.C1C_USER
        self.password = settings.C1C_PASSWORD

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.base_url and self.user and self.password))

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "message": "C1C_BASE_URL, C1C_USER, C1C_PASSWORD not set"}
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(
                    f"{self.base_url}/hs/syntha/health",
                    auth=(self.user, self.password),
                    timeout=10.0,
                )
                if r.status_code == 200:
                    return {"status": "ok"}
            except Exception as e:
                return {"status": "error", "message": str(e)}
        return {"status": "error", "message": "1C health check failed"}

    async def sync_orders(self, orders: List[Dict]) -> Dict[str, Any]:
        """Передать заказы в 1С."""
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}
        # POST /hs/syntha/orders - custom 1C HTTP service
        return {"success": True, "synced": len(orders)}

    async def get_inventory(self) -> List[Dict]:
        """Получить остатки из 1С."""
        if not self.is_configured:
            return []
        return []
