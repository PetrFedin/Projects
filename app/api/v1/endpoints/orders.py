from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any, Optional
from datetime import datetime
from pydantic import BaseModel

from app.api import deps
from app.api.deps import UserRole, check_permissions
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.api.schemas.order import OrderSchema, OrderDraftCreate, OrderDraftUpdate, OrderCreate, OrderItem, OrderItemCreate

from app.db.repositories.order import OrderRepository
from app.db.models.base import User, Order as OrderModel
from app.services.order_service import OrderService

router = APIRouter()

@router.get("/", response_model=GenericResponse[List[OrderSchema]])
async def get_orders(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    orders = await service.repo.get_all()
    return GenericResponse(data=orders)

@router.post("/draft", response_model=GenericResponse[OrderSchema])
async def create_order_draft(
    order_in: OrderDraftCreate,
    current_user: User = Depends(check_permissions([
        UserRole.BUYER_ADMIN, UserRole.BUYER, 
        UserRole.DISTRIBUTOR, UserRole.STORE_MANAGER,
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, UserRole.SALES_REP
    ])),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    created = await service.create_draft(order_in.model_dump())
    return GenericResponse(data=created)

@router.post("/{order_id}/items", response_model=GenericResponse[OrderItem])
async def add_order_item(
    order_id: int,
    item_data: OrderItemCreate,
    current_user: User = Depends(check_permissions([
        UserRole.BUYER_ADMIN, UserRole.BUYER, 
        UserRole.DISTRIBUTOR, UserRole.STORE_MANAGER
    ])),
    db: AsyncSession = Depends(deps.get_db)
):
    """Adds an item to a draft order."""
    service = OrderService(db, current_user=current_user)
    try:
        item = await service.add_order_item(order_id, item_data)
        return GenericResponse(data=item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{order_id}/validate", response_model=GenericResponse[dict])
async def validate_order(
    order_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    result = await service.validate_order(order_id)
    return GenericResponse(data=result)

@router.post("/{order_id}/submit", response_model=GenericResponse[OrderSchema])
async def submit_order(
    order_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    updated = await service.submit_order(order_id)
    return GenericResponse(data=updated)

@router.post("/{order_id}/cancel", response_model=GenericResponse[OrderSchema])
async def cancel_order(
    order_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    updated = await service.cancel_order(order_id)
    return GenericResponse(data=updated)

# --- Specific Draft Order Routes (Matching Block Requirements) ---

@router.get("/drafts", response_model=GenericResponse[List[OrderSchema]])
async def get_draft_orders(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Returns only draft orders for the organization."""
    service = OrderService(db, current_user=current_user)
    # Filter by draft status - this logic should ideally be in the repo/service
    query = select(OrderModel).where(OrderModel.status == "draft")
    if current_user.role != UserRole.PLATFORM_ADMIN:
        # Check both roles if it's a seller or buyer
        from sqlalchemy import or_
        query = query.where(or_(
            OrderModel.organization_id == current_user.organization_id,
            OrderModel.buyer_id == current_user.organization_id
        ))
    result = await db.execute(query)
    drafts = result.scalars().all()
    return GenericResponse(data=drafts)

@router.post("/drafts", response_model=GenericResponse[OrderSchema])
async def create_new_draft_order(
    order_in: OrderDraftCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    service = OrderService(db, current_user=current_user)
    created = await service.create_draft(order_in.model_dump())
    return GenericResponse(data=created)

@router.put("/drafts/{order_id}", response_model=GenericResponse[OrderSchema])
async def update_draft_order(
    order_id: int,
    data: OrderDraftUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Always-On Cart: persist draft between sessions (RepSpark)."""
    service = OrderService(db, current_user=current_user)
    updated = await service.update_draft(order_id, data.model_dump(exclude_none=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Draft order not found")
    return GenericResponse(data=updated)

@router.post("/drafts/{order_id}/submit", response_model=GenericResponse[OrderSchema])
async def submit_draft_order_explicit(
    order_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """Submits a draft order."""
    service = OrderService(db, current_user=current_user)
    updated = await service.submit_order(order_id)
    return GenericResponse(data=updated)
