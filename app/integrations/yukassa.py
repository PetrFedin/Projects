"""ЮKassa payment integration (stub + configured health)."""

from typing import Any, Dict, Optional

import httpx

from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class YukassaClient(BaseIntegrationClient):
    def __init__(self):
        self.shop_id = settings.YUKASSA_SHOP_ID
        self.secret = settings.YUKASSA_SECRET_KEY

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.shop_id and self.secret))

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "provider": "yukassa"}
        return {"status": "configured", "provider": "yukassa", "shop_id": self.shop_id}

    async def create_payment(
        self,
        amount_rub: float,
        order_id: str,
        description: str,
        return_url: str,
    ) -> Dict[str, Any]:
        if not self.is_configured:
            return {
                "success": False,
                "error": "not_configured",
                "instruction": "Set YUKASSA_SHOP_ID and YUKASSA_SECRET_KEY",
            }
        # Stub URL until live API contract; mirrors frontend workshop2-yukassa-stub
        amount = max(0, int(round(amount_rub)))
        payment_url = (
            f"https://yookassa.ru/checkout/stub?shopId={self.shop_id}"
            f"&amount={amount}&order={order_id}&return={return_url}"
        )
        return {
            "success": True,
            "payment_url": payment_url,
            "payment_id": f"yk-stub-{order_id}",
            "stub": True,
            "description": description,
        }

    async def get_payment_status(self, payment_id: str) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured"}
        return {"status": "pending", "payment_id": payment_id, "stub": True}
