from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.db.session import get_db
from app.db.repositories.circular import (
    CircularRepository, SubscriptionRepository,
    RentalRepository, CircularItemRepository
)
from app.api.schemas.circular import (
    MaterialLeftover, MaterialLeftoverCreate,
    SubscriptionPlan, SubscriptionPlanCreate,
    RentalOrder, RentalOrderCreate,
    CircularItem, CircularItemCreate
)
from app.db.models.base import (
    MaterialLeftover as MaterialModel,
    SubscriptionPlan as SubscriptionModel,
    RentalOrder as RentalModel,
    CircularItem as CircularItemModel
)

router = APIRouter()

@router.get("/materials", response_model=List[MaterialLeftover])
async def get_available_materials(name: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    repo = CircularRepository(db)
    return await repo.get_available(name)

@router.post("/materials", response_model=MaterialLeftover)
async def list_material(mat_in: MaterialLeftoverCreate, db: AsyncSession = Depends(get_db)):
    repo = CircularRepository(db)
    new_mat = MaterialModel(**mat_in.model_dump())
    return await repo.create(new_mat)

@router.get("/subscriptions", response_model=List[SubscriptionPlan])
async def get_all_plans(db: AsyncSession = Depends(get_db)):
    repo = SubscriptionRepository(db)
    return await repo.get_all()

@router.post("/subscriptions", response_model=SubscriptionPlan)
async def create_plan(plan_in: SubscriptionPlanCreate, db: AsyncSession = Depends(get_db)):
    repo = SubscriptionRepository(db)
    new_plan = SubscriptionModel(**plan_in.model_dump())
    return await repo.create(new_plan)

@router.get("/rentals/customer/{customer_id}", response_model=List[RentalOrder])
async def get_customer_rentals(customer_id: str, db: AsyncSession = Depends(get_db)):
    repo = RentalRepository(db)
    return await repo.get_by_customer(customer_id)

@router.post("/rentals", response_model=RentalOrder)
async def create_rental(rental_in: RentalOrderCreate, db: AsyncSession = Depends(get_db)):
    repo = RentalRepository(db)
    new_rental = RentalModel(**rental_in.model_dump())
    return await repo.create(new_rental)

@router.get("/items/{sku_id}", response_model=List[CircularItem])
async def get_circular_items(sku_id: str, db: AsyncSession = Depends(get_db)):
    repo = CircularItemRepository(db)
    return await repo.get_by_sku(sku_id)

@router.post("/items", response_model=CircularItem)
async def create_circular_item(item_in: CircularItemCreate, db: AsyncSession = Depends(get_db)):
    repo = CircularItemRepository(db)
    new_item = CircularItemModel(**item_in.model_dump())
    return await repo.create(new_item)
