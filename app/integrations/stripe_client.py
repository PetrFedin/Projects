"""Stripe payment integration (international cards)."""

from typing import Any, Dict

from app.core.config import settings
from .base import BaseIntegrationClient
from .policy import integration_ready


class StripeClient(BaseIntegrationClient):
    def __init__(self):
        self.secret_key = settings.STRIPE_SECRET_KEY

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.secret_key))

    async def health_check(self) -> Dict[str, Any]:
        if not self.is_configured:
            return {"status": "not_configured", "provider": "stripe"}
        return {"status": "configured", "provider": "stripe"}

    async def create_payment(
        self,
        amount_cents: int,
        order_id: str,
        description: str,
        return_url: str,
        currency: str = "usd",
    ) -> Dict[str, Any]:
        if not self.is_configured:
            return {
                "success": False,
                "error": "not_configured",
                "instruction": "Set STRIPE_SECRET_KEY",
            }
        payment_url = (
            f"https://checkout.stripe.com/stub?"
            f"amount={amount_cents}&currency={currency}&order={order_id}&return={return_url}"
        )
        return {
            "success": True,
            "payment_url": payment_url,
            "payment_id": f"stripe-stub-{order_id}",
            "stub": True,
            "description": description,
        }
