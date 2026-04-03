"""Оплата: СБП, эквайринг (Тинькофф, Сбер)."""

from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class PaymentClient(BaseIntegrationClient):
    """Payment integration (Tinkoff, SBP)."""

    def __init__(self):
        self.provider = settings.PAYMENT_PROVIDER
        self.tinkoff_terminal = settings.TINKOFF_TERMINAL_KEY
        self.tinkoff_secret = settings.TINKOFF_SECRET_KEY
        self.sbp_merchant = settings.SBP_MERCHANT_ID

    @property
    def is_configured(self) -> bool:
        if self.provider == "tinkoff":
            return integration_ready(bool(self.tinkoff_terminal and self.tinkoff_secret))
        if self.provider == "sbp":
            return integration_ready(bool(self.sbp_merchant))
        return False

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "message": "Payment credentials not set"}
        return {"status": "ok", "provider": self.provider}

    async def create_payment(
        self,
        amount_kopecks: int,
        order_id: str,
        description: str,
        return_url: str,
        sbp_phone: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Создать платёж. Для Тинькофф — карта; для SBP — QR/ссылка.
        Returns: {payment_url, payment_id, status}
        """
        if not self.is_configured:
            return {"success": False, "error": "not_configured"}

        if self.provider == "tinkoff":
            # Tinkoff Acquiring API
            import hashlib
            params = {
                "TerminalKey": self.tinkoff_terminal,
                "Amount": amount_kopecks,
                "OrderId": order_id,
                "Description": description,
                "SuccessURL": return_url,
                "FailURL": return_url,
            }
            token_str = "".join(str(params.get(k, "")) for k in sorted(params.keys())) + self.tinkoff_secret
            params["Token"] = hashlib.sha256(token_str.encode()).hexdigest()
            try:
                async with httpx.AsyncClient() as client:
                    r = await client.post(
                        "https://securepay.tinkoff.ru/v2/Init",
                        json=params,
                        timeout=10.0,
                    )
                    if r.status_code == 200:
                        data = r.json()
                        if data.get("Success"):
                            return {
                                "success": True,
                                "payment_id": data.get("PaymentId"),
                                "payment_url": data.get("PaymentURL"),
                                "status": data.get("Status"),
                            }
                    return {"success": False, "error": r.json().get("Message", "Unknown error")}
            except Exception as e:
                return {"success": False, "error": str(e)}

        if self.provider == "sbp":
            # SBP (Система быстрых платежей) — через банк-эквайер
            return {
                "success": True,
                "payment_id": order_id,
                "payment_url": f"https://sbp.example.com/pay/{order_id}",
                "status": "created",
                "qr_payload": f"bank://{self.sbp_merchant}/{order_id}",
            }

        return {"success": False, "error": "unknown_provider"}

    async def get_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Получить статус платежа."""
        if not self.is_configured:
            return {"status": "not_configured"}
        if self.provider == "tinkoff":
            try:
                async with httpx.AsyncClient() as client:
                    r = await client.post(
                        "https://securepay.tinkoff.ru/v2/GetState",
                        json={
                            "TerminalKey": self.tinkoff_terminal,
                            "PaymentId": payment_id,
                        },
                        timeout=10.0,
                    )
                    if r.status_code == 200:
                        data = r.json()
                        return {"status": data.get("Status", "unknown"), "success": data.get("Success")}
            except Exception:
                pass
        return {"status": "unknown"}
