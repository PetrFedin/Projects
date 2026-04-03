from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.db.repositories.custom import CustomRepository
from app.api.schemas.custom import CustomOrder, CustomOrderCreate
from app.db.models.base import CustomOrder as OrderModel

router = APIRouter()

@router.get("/orders/{customer_id}", response_model=List[CustomOrder])
async def get_customer_custom_orders(customer_id: str, db: AsyncSession = Depends(get_db)):
    repo = CustomRepository(db)
    return await repo.get_by_customer(customer_id)

@router.post("/orders", response_model=CustomOrder)
async def place_custom_order(order_in: CustomOrderCreate, db: AsyncSession = Depends(get_db)):
    repo = CustomRepository(db)
    new_order = OrderModel(**order_in.model_dump())
    return await repo.create(new_order)

@router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: int, status: str, db: AsyncSession = Depends(get_db)):
    repo = CustomRepository(db)
    order = await repo.get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Custom order not found")
    
    await repo.update(order.id, status=status)
    return {"message": f"Order status updated to {status}"}
