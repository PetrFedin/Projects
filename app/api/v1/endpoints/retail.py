from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.retail_service import RetailService
from app.api.schemas.retail import (
    POSTransactionCreate, InventoryUpdate, ClientelingCreate
)

router = APIRouter()

@router.post("/pos/transaction", response_model=GenericResponse[Dict[str, Any]])
async def process_transaction(
    tx_in: POSTransactionCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = RetailService(db, current_user)
    tx = await service.process_pos_transaction(tx_in)
    return GenericResponse(data={"id": tx.id, "total": tx.total_amount, "status": tx.status})

@router.post("/inventory/update", response_model=GenericResponse[Dict[str, Any]])
async def update_inventory(
    inv_in: InventoryUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = RetailService(db, current_user)
    stock = await service.update_stock(inv_in)
    return GenericResponse(data={"id": stock.id, "sku_id": stock.sku_id, "quantity": stock.quantity})

@router.post("/clienteling/interaction", response_model=GenericResponse[Dict[str, Any]])
async def add_interaction(
    rec_in: ClientelingCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = RetailService(db, current_user)
    rec = await service.add_interaction(rec_in)
    return GenericResponse(data={"id": rec.id, "status": "recorded"})
