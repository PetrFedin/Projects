"""
Marketplace connector abstraction (Shopify/Ozon/WB).
MVP: stub returns when API keys not configured. Infrastructure ready for real API.
"""
from abc import ABC, abstractmethod
from typing import Any

from app.integrations.policy import integration_ready


class MarketplaceConnector(ABC):
    """Base for marketplace integrations. is_configured: True when API keys set."""

    @property
    def is_configured(self) -> bool:
        return False
    """Base for marketplace integrations: products, orders, inventory sync."""

    @abstractmethod
    async def list_products(self, limit: int = 50, cursor: str | None = None) -> dict[str, Any]:
        """List products from marketplace. Returns {items, next_cursor}."""

    @abstractmethod
    async def sync_product(self, sku_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        """Create or update product on marketplace."""

    @abstractmethod
    async def list_orders(self, status: str | None = None, limit: int = 50) -> dict[str, Any]:
        """List orders. status: pending|fulfilled|cancelled."""

    @abstractmethod
    async def update_inventory(self, sku_id: str, quantity: int) -> bool:
        """Update stock level for SKU."""

    async def get_order(self, order_id: str) -> dict[str, Any] | None:
        """Fetch single order. Override in connector."""
        return None

    async def batch_sync_products(self, items: list[dict[str, Any]]) -> dict[str, Any]:
        """Batch sync. Override for efficiency."""
        results = []
        for i in items:
            r = await self.sync_product(i.get("sku_id", ""), i.get("payload", i))
            results.append(r)
        return {"synced": len(results), "results": results}

    async def list_inventory(self, sku_ids: list[str] | None = None) -> dict[str, Any]:
        """List inventory. sku_ids=None means all."""
        return {"items": [], "provider": "base"}


class ShopifyConnector(MarketplaceConnector):
    """Shopify API. Configure via SHOPIFY_SHOP_URL, SHOPIFY_ACCESS_TOKEN."""

    def __init__(self, shop_url: str = "", access_token: str = ""):
        self.shop_url = shop_url or ""
        self.access_token = access_token or ""

    @property
    def is_configured(self) -> bool:
        return bool(self.shop_url and self.access_token)

    async def list_products(self, limit: int = 50, cursor: str | None = None) -> dict[str, Any]:
        return {"items": [], "next_cursor": None, "provider": "shopify"}

    async def sync_product(self, sku_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {"sku_id": sku_id, "external_id": None, "provider": "shopify", "status": "stub"}

    async def list_orders(self, status: str | None = None, limit: int = 50) -> dict[str, Any]:
        return {"items": [], "provider": "shopify"}

    async def update_inventory(self, sku_id: str, quantity: int) -> bool:
        return True

    async def get_order(self, order_id: str) -> dict[str, Any] | None:
        return {"id": order_id, "status": "stub", "provider": "shopify"}


class OzonConnector(MarketplaceConnector):
    """Ozon. Configure via OZON_CLIENT_ID, OZON_API_KEY."""

    def __init__(self, client_id: str = "", api_key: str = ""):
        self.client_id = client_id or ""
        self.api_key = api_key or ""

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.client_id and self.api_key))

    async def list_products(self, limit: int = 50, cursor: str | None = None) -> dict[str, Any]:
        return {"items": [], "next_cursor": None, "provider": "ozon"}

    async def sync_product(self, sku_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {"sku_id": sku_id, "external_id": None, "provider": "ozon", "status": "stub"}

    async def list_orders(self, status: str | None = None, limit: int = 50) -> dict[str, Any]:
        return {"items": [], "provider": "ozon"}

    async def update_inventory(self, sku_id: str, quantity: int) -> bool:
        return True

    async def get_order(self, order_id: str) -> dict[str, Any] | None:
        return {"id": order_id, "status": "stub", "provider": "ozon"}


class WBConnector(MarketplaceConnector):
    """Wildberries. Configure via WB_API_KEY."""

    def __init__(self, api_key: str = ""):
        self.api_key = api_key or ""

    @property
    def is_configured(self) -> bool:
        return integration_ready(bool(self.api_key))

    async def list_products(self, limit: int = 50, cursor: str | None = None) -> dict[str, Any]:
        return {"items": [], "next_cursor": None, "provider": "wb"}

    async def sync_product(self, sku_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {"sku_id": sku_id, "external_id": None, "provider": "wb", "status": "stub"}

    async def list_orders(self, status: str | None = None, limit: int = 50) -> dict[str, Any]:
        return {"items": [], "provider": "wb"}

    async def update_inventory(self, sku_id: str, quantity: int) -> bool:
        return True

    async def get_order(self, order_id: str) -> dict[str, Any] | None:
        return {"id": order_id, "status": "stub", "provider": "wb"}


def get_connector(provider: str, **kwargs) -> MarketplaceConnector:
    """Factory: loads from settings when kwargs empty. Ready for per-brand config."""
    try:
        from app.core.config import settings
    except ImportError:
        settings = None
    if provider == "shopify":
        return ShopifyConnector(
            kwargs.get("shop_url") or (settings.SHOPIFY_SHOP_URL if settings else ""),
            kwargs.get("access_token") or (settings.SHOPIFY_ACCESS_TOKEN if settings else ""),
        )
    if provider == "ozon":
        return OzonConnector(
            kwargs.get("client_id") or (settings.OZON_CLIENT_ID if settings else ""),
            kwargs.get("api_key") or (settings.OZON_API_KEY if settings else ""),
        )
    if provider == "wb":
        return WBConnector(kwargs.get("api_key") or (settings.WB_API_KEY if settings else ""))
    raise ValueError(f"Unknown marketplace: {provider}")
