from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.api.deps import check_permissions, UserRole
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.wholesale_service import WholesaleService
from app.api.schemas.wholesale import (
    B2BDiscount, B2BDiscountCreate,
    MOQSetting, MOQSettingCreate,
    CreditLimit, CreditLimitCreate,
    SeasonalCredit, SeasonalCreditCreate,
    WholesaleMessage, WholesaleMessageCreate,
    OrderLog, OrderLogCreate,
    CreditMemo, CreditMemoCreate,
    WholesaleBNPL, BNPLCreate,
    DealerExclusivity, ExclusivityCreate,
    Linesheet, LinesheetCreate,
    Quote, QuoteCreate, QuoteUpdate,
    DraftOrderFromSelection, LinesheetItem, LinesheetItemCreate,
    Assortment, AssortmentCreate, AssortmentUpdate
)
from app.api.v1.endpoints.orders import OrderSchema # Import the schema for order responses

router = APIRouter()

@router.get("/discounts", response_model=GenericResponse[List[B2BDiscount]])
async def get_all_discounts(
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    discounts = await service.get_all_discounts()
    return GenericResponse(data=discounts[:limit])

@router.post("/discounts", response_model=GenericResponse[B2BDiscount])
async def create_discount(
    discount_in: B2BDiscountCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    created = await service.create_discount(discount_in.model_dump())
    return GenericResponse(data=created)

@router.get("/moq/{sku_id}", response_model=GenericResponse[Optional[MOQSetting]])
async def get_sku_moq(
    sku_id: str,
    country_code: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    moq = await service.get_sku_moq(sku_id, country_code)
    return GenericResponse(data=moq)

@router.post("/moq", response_model=GenericResponse[MOQSetting])
async def create_moq(
    moq_in: MOQSettingCreate,
    current_user: User = Depends(check_permissions([UserRole.BRAND_ADMIN, UserRole.MERCHANDISER])),
    db: AsyncSession = Depends(deps.get_db)
):
    from app.db.models.base import MOQSetting
    from app.db.repositories.wholesale import MOQRepository
    repo = MOQRepository(db, current_user=current_user)
    moq = MOQSetting(**moq_in.model_dump())
    created = await repo.create(moq)
    return GenericResponse(data=created)

# --- Quotes (SparkLayer, RepSpark) ---
@router.get("/quotes", response_model=GenericResponse[List[Quote]])
async def get_quotes(
    limit: int = 100,
    status: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """status: draft|sent|accepted|expired filter."""
    service = WholesaleService(db, current_user=current_user)
    quotes = await service.get_quotes()
    if status:
        quotes = [q for q in quotes if getattr(q, "status", None) == status]
    return GenericResponse(data=quotes[:limit])

@router.post("/quotes", response_model=GenericResponse[Quote])
async def create_quote(
    quote_in: QuoteCreate,
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, UserRole.SALES_REP
    ])),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    quote = await service.create_quote(quote_in.model_dump())
    return GenericResponse(data=quote)

class QuoteStatusUpdate(BaseModel):
    status: str  # draft, sent, accepted, expired

@router.patch("/quotes/{quote_id}/status", response_model=GenericResponse[Quote])
async def update_quote_status(
    quote_id: int,
    body: QuoteStatusUpdate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    quote = await service.update_quote_status(quote_id, body.status)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return GenericResponse(data=quote)

@router.get("/linesheets", response_model=GenericResponse[List[Linesheet]])
async def get_linesheets(
    season: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    linesheets = await service.get_linesheets(season)
    return GenericResponse(data=linesheets[:limit])

@router.post("/linesheets", response_model=GenericResponse[Linesheet])
async def create_linesheet(
    linesheet_in: LinesheetCreate,
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, 
        UserRole.SALES_REP, UserRole.DISTRIBUTOR
    ])),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    created = await service.create_linesheet(linesheet_in)
    return GenericResponse(data=created)

@router.post("/linesheets/{linesheet_id}/items", response_model=GenericResponse[LinesheetItem])
async def add_linesheet_item(
    linesheet_id: int,
    item_data: LinesheetItemCreate,
    current_user: User = Depends(check_permissions([
        UserRole.BRAND_ADMIN, UserRole.BRAND_MANAGER, 
        UserRole.SALES_REP, UserRole.DISTRIBUTOR
    ])),
    db: AsyncSession = Depends(deps.get_db)
):
    """Adds a product item to a linesheet."""
    service = WholesaleService(db, current_user=current_user)
    try:
        item = await service.add_linesheet_item(linesheet_id, item_data)
        return GenericResponse(data=item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/linesheets/{linesheet_id}/generate", response_model=GenericResponse[dict])
async def generate_linesheet_pdf(
    linesheet_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    pdf_url = await service.generate_linesheet_pdf(linesheet_id)
    if not pdf_url:
        raise HTTPException(status_code=404, detail="Linesheet not found")
    return GenericResponse(data={"pdf_url": pdf_url})

@router.get("/credit-limits/{partner_id}", response_model=GenericResponse[Optional[CreditLimit]])
async def get_partner_credit_limit(
    partner_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    limit = await service.get_partner_credit_limit(partner_id)
    return GenericResponse(data=limit)

@router.get("/messages/{order_id}", response_model=GenericResponse[List[WholesaleMessage]])
async def get_order_messages(
    order_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    messages = await service.get_order_messages(order_id)
    return GenericResponse(data=messages[:limit])

@router.get("/order-logs/{order_id}", response_model=GenericResponse[List[OrderLog]])
async def get_order_logs(
    order_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    logs = await service.log_repo.get_by_order(order_id)
    return GenericResponse(data=logs[:limit])

# --- Integrated Wholesale Workflows ---

@router.post("/orders/draft-from-selection", response_model=GenericResponse[OrderSchema])
async def create_draft_from_selection(
    selection_in: DraftOrderFromSelection,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """
    Creates an order draft directly from a showroom/linesheet selection.
    Integrates Showroom discovery with Order Management.
    """
    service = WholesaleService(db, current_user=current_user)
    draft = await service.create_draft_from_selection(selection_in.model_dump())
    return GenericResponse(data=draft)

@router.post("/showrooms/{showroom_id}/attach-linesheet/{linesheet_id}", response_model=GenericResponse[dict])
async def attach_linesheet_to_showroom(
    showroom_id: int,
    linesheet_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """Links a specific linesheet to a digital showroom."""
    service = WholesaleService(db, current_user=current_user)
    await service.attach_linesheet_to_showroom(showroom_id, linesheet_id)
    return GenericResponse(data={"status": "attached"})

# --- Assortments (NuOrder) ---
@router.get("/assortments", response_model=GenericResponse[List[Assortment]])
async def get_assortments(
    collection_id: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    assortments = await service.get_assortments(collection_id)
    return GenericResponse(data=assortments[:limit])

@router.get("/assortments/{assortment_id}", response_model=GenericResponse[Optional[Assortment]])
async def get_assortment(
    assortment_id: int,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    a = await service.get_assortment(assortment_id)
    if not a:
        raise HTTPException(status_code=404, detail="Assortment not found")
    return GenericResponse(data=a)

@router.post("/assortments", response_model=GenericResponse[Assortment])
async def create_assortment(
    data: AssortmentCreate,
    current_user: User = Depends(check_permissions([UserRole.BRAND_ADMIN, UserRole.MERCHANDISER])),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    created = await service.create_assortment(data)
    return GenericResponse(data=created)

@router.patch("/assortments/{assortment_id}", response_model=GenericResponse[Assortment])
async def update_assortment(
    assortment_id: int,
    data: AssortmentUpdate,
    current_user: User = Depends(check_permissions([UserRole.BRAND_ADMIN, UserRole.MERCHANDISER])),
    db: AsyncSession = Depends(deps.get_db)
):
    service = WholesaleService(db, current_user=current_user)
    updated = await service.update_assortment(assortment_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Assortment not found")
    return GenericResponse(data=updated)
