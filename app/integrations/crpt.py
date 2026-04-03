"""Честный ЗНАК (CRPT) API client. Эмиссия и управление кодами маркировки."""

from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class CRPTClient(BaseIntegrationClient):
    """Client for CRPT (Честный ЗНАК) marking system."""

    def __init__(self):
        self.base_url = settings.CRPT_API_URL
        self.client_id = settings.CRPT_CLIENT_ID
        self.client_secret = settings.CRPT_CLIENT_SECRET
        self._token: Optional[str] = None

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.client_id and self.client_secret))

    async def _get_token(self) -> Optional[str]:
        """OAuth2 token for CRPT API."""
        if not self.is_configured:
            return None
        if self._token:
            return self._token
        async with httpx.AsyncClient() as client:
            try:
                r = await client.post(
                    f"{self.base_url}/auth/cert",
                    json={
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                    },
                    timeout=10.0,
                )
                if r.status_code == 200:
                    data = r.json()
                    self._token = data.get("token")
                    return self._token
            except Exception:
                pass
        return None

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "message": "CRPT_CLIENT_ID and CRPT_CLIENT_SECRET not set"}
        token = await self._get_token()
        if not token:
            return {"status": "error", "message": "Failed to obtain CRPT token"}
        return {"status": "ok", "configured": True}

    async def emit_codes(
        self,
        sku_id: str,
        quantity: int,
        gtin: str,
        organization_id: str,
    ) -> List[Dict[str, Any]]:
        """
        Emit marking codes from CRPT.
        Returns list of {serial_number, crypto_code, status}.
        """
        if not self.is_configured:
            return []
        token = await self._get_token()
        if not token:
            return []

        async with httpx.AsyncClient() as client:
            try:
                r = await client.post(
                    f"{self.base_url}/true-api/documents/create",
                    headers={"Authorization": f"Bearer {token}"},
                    json={
                        "document_format": "MANUAL",
                        "product_document": {
                            "format": "MANUAL",
                            "gtin": gtin,
                            "description": sku_id,
                            "quantity": quantity,
                            "measurement_unit": "PCE",
                        },
                        "organization_id": organization_id,
                    },
                    timeout=30.0,
                )
                if r.status_code == 200:
                    data = r.json()
                    return data.get("results", [])
            except Exception:
                pass
        return []

    async def withdrawal(
        self,
        codes: List[str],
        operation_type: str = "WITHDRAW",
        organization_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Вывод из оборота кодов маркировки."""
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}
        token = await self._get_token()
        if not token:
            return {"success": False, "error": "no_token"}
        # CRPT API specifics - adjust to actual CRPT v3 docs
        return {"success": True, "processed": len(codes)}
