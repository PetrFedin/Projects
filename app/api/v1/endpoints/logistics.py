from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_active_user
from app.db.models.base import User
from app.services.logistics_service import LogisticsService
from pydantic import BaseModel, Field

router = APIRouter()


class PackingItem(BaseModel):
    sku_id: str
    quantity: int
    weight: float

class PackingListCreate(BaseModel):
    order_id: str
    items: List[PackingItem]

class CustomsCreate(BaseModel):
    order_id: str
    country_code: str

class BottleneckCreate(BaseModel):
    location_id: str
    severity: str = "medium"
    impact_description: str
    delay_days_est: int = 0

@router.post("/bottlenecks", response_model=Dict[str, Any])
async def create_bottleneck(
    data: BottleneckCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Creates a logistics/supply chain bottleneck record."""
    from app.db.models.base import SupplyChainBottleneck
    from app.core.datetime_util import utc_now
    bn = SupplyChainBottleneck(
        organization_id=current_user.organization_id,
        location_id=data.location_id,
        severity=data.severity,
        impact_description=data.impact_description,
        delay_days_est=data.delay_days_est,
    )
    db.add(bn)
    await db.commit()
    await db.refresh(bn)
    return {"id": bn.id, "status": "created"}

@router.post("/packing-lists", response_model=Dict[str, Any])
async def create_packing_list(
    data: PackingListCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Creates a new packing list for an order."""
    service = LogisticsService(db, current_user)
    items_list = [i.dict() for i in data.items]
    new_list = await service.create_packing_list(data.order_id, items_list)
    return {"status": "success", "id": new_list.id, "box_number": new_list.box_number}

@router.post("/customs", response_model=Dict[str, Any])
async def prepare_customs(
    data: CustomsCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Prepares a customs declaration for an international order."""
    service = LogisticsService(db, current_user)
    decl = await service.prepare_customs_declaration(data.order_id, data.country_code)
    return {"status": "success", "id": decl.id, "decl_number": decl.declaration_number, "total_duties": decl.total_duties_usd}

class ShipmentTrackingStore(BaseModel):
    provider: str = "cdek"
    external_id: str


@router.post("/shipments/{order_id}/tracking", response_model=Dict[str, Any])
async def store_shipment_tracking(
    order_id: str,
    data: ShipmentTrackingStore,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Store CDEK/other tracking UUID. Call after creating shipment via CDEK API."""
    service = LogisticsService(db, current_user)
    ok = await service.store_shipment_tracking(order_id, data.provider, data.external_id)
    return {"stored": ok, "order_id": order_id, "provider": data.provider}


@router.get("/shipments/{order_id}", response_model=Dict[str, Any])
async def get_shipment_status(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Shipment status. Uses CDEK when tracking stored via POST /shipments/{id}/tracking."""
    service = LogisticsService(db, current_user)
    status = await service.get_shipment_status(order_id)
    return status


class DeliveryCalculateRequest(BaseModel):
    from_city: str
    to_city: str
    weight_grams: int
    length_cm: float = 10
    width_cm: float = 10
    height_cm: float = 10


@router.post("/calculate-delivery", response_model=List[Dict[str, Any]])
async def calculate_delivery(
    data: DeliveryCalculateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Calculate delivery options (CDEK when configured)."""
    service = LogisticsService(db, current_user)
    rates = await service.calculate_delivery(
        from_city=data.from_city,
        to_city=data.to_city,
        weight_grams=data.weight_grams,
        length_cm=data.length_cm,
        width_cm=data.width_cm,
        height_cm=data.height_cm,
    )
    return rates
