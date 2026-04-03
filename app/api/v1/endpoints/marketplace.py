"""Marketplace connector API (Shopify, Ozon, WB)."""
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api import deps
from app.api.schemas.base import GenericResponse
from app.db.models.base import User
from app.integrations.marketplace.base import get_connector

router = APIRouter()


class MarketplaceSyncRequest(BaseModel):
    provider: str
    shop_url: Optional[str] = None
    access_token: Optional[str] = None
    client_id: Optional[str] = None
    api_key: Optional[str] = None


@router.get("/connectors/{provider}/products", response_model=GenericResponse[dict])
async def list_marketplace_products(
    provider: str,
    limit: int = 50,
    offset: int = 0,
    cursor: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
):
    """List products from marketplace (Shopify/Ozon/WB). offset: skip N items."""
    try:
        conn = get_connector(provider)
        result = await conn.list_products(limit=limit, cursor=cursor)
        items = result.get("items", [])
        if offset > 0 and items:
            result = {**result, "items": items[offset:offset + limit], "offset": offset}
        return GenericResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class SyncProductRequest(BaseModel):
    sku_id: str
    payload: dict[str, Any] = {}


@router.post("/connectors/{provider}/sync-product", response_model=GenericResponse[dict])
async def sync_product_to_marketplace(
    provider: str,
    req: SyncProductRequest,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Push product to marketplace."""
    try:
        conn = get_connector(provider)
        result = await conn.sync_product(req.sku_id, req.payload)
        return GenericResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/connectors/{provider}/orders/{order_id}", response_model=GenericResponse[dict])
async def get_marketplace_order(
    provider: str,
    order_id: str,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Fetch order from marketplace."""
    try:
        conn = get_connector(provider)
        result = await conn.get_order(order_id)
        return GenericResponse(data=result or {"error": "Order not found"})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class BatchSyncRequest(BaseModel):
    items: list[dict[str, Any]] = []


@router.post("/connectors/{provider}/batch-sync", response_model=GenericResponse[dict])
async def batch_sync_products(
    provider: str,
    req: BatchSyncRequest,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Batch sync products to marketplace."""
    try:
        conn = get_connector(provider)
        result = await conn.batch_sync_products(req.items)
        return GenericResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/connectors/{provider}/inventory", response_model=GenericResponse[dict])
async def list_marketplace_inventory(
    provider: str,
    sku_ids: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
):
    """List inventory. sku_ids: comma-separated or omit for all. limit: max items."""
    try:
        conn = get_connector(provider)
        ids = [x.strip() for x in (sku_ids or "").split(",") if x.strip()] if sku_ids else None
        result = await conn.list_inventory(ids)
        items = result.get("items", [])
        if limit and items:
            result = {**result, "items": items[:limit], "limit": limit}
        return GenericResponse(data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
