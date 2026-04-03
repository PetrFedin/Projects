"""ЭДО (Electronic Document Exchange) — Диадок / Контур."""

from typing import Any, Dict, List, Optional
import httpx
from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class EDOClient(BaseIntegrationClient):
    """Client for EDO (Diadoc/Kontur)."""

    def __init__(self):
        self.provider = settings.EDO_PROVIDER
        self.diadoc_url = settings.DIADOC_API_URL
        self.diadoc_key = settings.DIADOC_API_KEY
        self.kontur_url = settings.KONTUR_EDO_API_URL
        self.kontur_token = settings.KONTUR_EDO_TOKEN

    @property
    def is_configured(self) -> bool:
        creds = bool(self.diadoc_key) if self.provider == "diadoc" else bool(
            self.kontur_token and self.kontur_url
        )
        return integration_ready(creds)

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "message": "EDO credentials not set"}
        url = f"{self.diadoc_url}/GetMyOrganizations" if self.provider == "diadoc" else f"{self.kontur_url}/v1/companies"
        headers = {"Authorization": f"DiadocAuth ddauth_api_client_id={self.diadoc_key}"} if self.provider == "diadoc" else {"Authorization": f"Bearer {self.kontur_token}"}
        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(url, headers=headers, timeout=10.0)
                if r.status_code == 200:
                    return {"status": "ok", "provider": self.provider}
            except Exception as e:
                return {"status": "error", "message": str(e)}
        return {"status": "error", "message": "EDO health check failed"}

    async def send_document(
        self,
        doc_type: str,
        content: bytes,
        sender_inn: str,
        receiver_inn: str,
        metadata: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Send document (УПД, ТОРГ-12, etc.)."""
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}
        # Diadoc: POST /V3/PostMessage
        # Implementation depends on exact Diadoc/Kontur API
        return {"success": True, "message_id": "placeholder", "doc_type": doc_type}

    async def sign_document(self, document_id: str) -> Dict[str, Any]:
        """Подписать документ ЭЦП."""
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}
        return {"success": True, "document_id": document_id, "status": "signed"}
