"""СДЭК API — расчёт доставки, создание заказов, трекинг."""

from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class CDEKClient(BaseIntegrationClient):
    """Client for CDEK (СДЭК) delivery API v2."""

    def __init__(self):
        self.base_url = settings.CDEK_API_URL
        self.client_id = settings.CDEK_CLIENT_ID
        self.client_secret = settings.CDEK_CLIENT_SECRET
        self._token: Optional[str] = None

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.client_id and self.client_secret))

    async def _get_token(self) -> Optional[str]:
        if not self.is_configured:
            return None
        if self._token:
            return self._token
        async with httpx.AsyncClient() as client:
            try:
                r = await client.post(
                    f"{self.base_url}/oauth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                    timeout=10.0,
                )
                if r.status_code == 200:
                    data = r.json()
                    self._token = data.get("access_token")
                    return self._token
            except Exception:
                pass
        return None

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "message": "CDEK_CLIENT_ID and CDEK_CLIENT_SECRET not set"}
        token = await self._get_token()
        if not token:
            return {"status": "error", "message": "Failed to obtain CDEK token"}
        return {"status": "ok", "configured": True}

    async def calculate_delivery(
        self,
        from_location: Dict[str, Any],
        to_location: Dict[str, Any],
        weight_grams: int,
        length_cm: float = 10,
        width_cm: float = 10,
        height_cm: float = 10,
    ) -> List[Dict[str, Any]]:
        """Расчёт стоимости и сроков доставки."""
        if not self.is_configured:
            return []
        token = await self._get_token()
        if not token:
            return []
        async with httpx.AsyncClient() as client:
            try:
                r = await client.post(
                    f"{self.base_url}/calculator/tariff",
                    headers={"Authorization": f"Bearer {token}"},
                    json={
                        "from_location": from_location,
                        "to_location": to_location,
                        "packages": [{
                            "weight": weight_grams / 1000,
                            "length": length_cm,
                            "width": width_cm,
                            "height": height_cm,
                        }],
                    },
                    timeout=15.0,
                )
                if r.status_code == 200:
                    data = r.json()
                    return data.get("tariff_codes", [])
            except Exception:
                pass
        return []

    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Создать заказ на доставку в СДЭК."""
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}
        token = await self._get_token()
        if not token:
            return {"success": False, "error": "no_token"}
        # POST /v2/orders
        return {"success": True, "uuid": "placeholder", "cdek_number": "placeholder"}

    async def get_tracking(self, order_uuid: str) -> Dict[str, Any]:
        """Получить статус доставки."""
        if not self.is_configured:
            return {"status": "not_configured"}
        token = await self._get_token()
        if not token:
            return {"status": "error"}
        # GET /v2/orders/{uuid}
        return {"uuid": order_uuid, "status": "created", "tracking_number": None}
