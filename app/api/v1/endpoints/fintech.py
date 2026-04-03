from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.api import deps
from app.db.repositories.fintech import (
    InvestmentRepository, ContributionRepository, TransactionSplitRepository,
    InvoiceRepository, FactoringRepository, InsuranceRepository, LiquidityRepository, AdvancedCostingRepository, BudgetRepository
)
from app.api.schemas.fintech import (
    InvestmentCampaign, InvestmentCampaignCreate, Contribution,
    ContributionCreate, CampaignStatusUpdate,
    TransactionSplit, TransactionSplitCreate,
    Invoice, InvoiceCreate,
    FactoringRequest, FactoringRequestCreate,
    CargoInsurance, CargoInsuranceCreate,
    BrandLiquidity, BrandLiquidityCreate,
    AdvancedCosting, AdvancedCostingCreate,
    FinanceBudget, FinanceBudgetCreate
)
from app.db.models.base import (
    User,
    InvestmentCampaign as CampaignModel,
    InvestmentContribution as ContributionModel,
    TransactionSplit as SplitModel,
    Invoice as InvoiceModel,
    FactoringRequest as FactoringModel,
    CargoInsurance as InsuranceModel,
    BrandLiquidity as LiquidityModel,
    AdvancedCosting as CostingModel,
    FinanceBudget as BudgetModel
)

from app.api.schemas.base import GenericResponse
from app.services.fintech_service import FintechService

router = APIRouter()

@router.get("/campaigns", response_model=GenericResponse[List[InvestmentCampaign]])
async def get_active_campaigns(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InvestmentRepository(db, current_user=current_user)
    data = await repo.get_all()
    return GenericResponse(data=data)

@router.post("/campaigns", response_model=GenericResponse[InvestmentCampaign])
async def create_campaign(
    campaign_in: InvestmentCampaignCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    campaign = CampaignModel(
        organization_id=current_user.organization_id,
        brand_id=campaign_in.brand_id,
        title=campaign_in.title,
        description=campaign_in.description,
        target_amount=campaign_in.target_amount,
        equity_offered=campaign_in.equity_offered,
        status=campaign_in.status,
        end_date=campaign_in.end_date,
    )
    repo = InvestmentRepository(db, current_user=current_user)
    created = await repo.create(campaign)
    return GenericResponse(data=created)

@router.post("/invest", response_model=GenericResponse[Contribution])
async def invest_in_campaign(
    invest_in: ContributionCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FintechService(db, current_user)
    contribution = await service.invest_in_campaign(invest_in.campaign_id, invest_in.amount)
    return GenericResponse(data=contribution)

@router.post("/invoices", response_model=GenericResponse[Invoice])
async def create_invoice(
    invoice_in: InvoiceCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FintechService(db, current_user)
    invoice = await service.create_invoice(invoice_in.model_dump())
    return GenericResponse(data=invoice)

@router.post("/factoring", response_model=GenericResponse[FactoringRequest])
async def create_factoring_request(
    fact_in: FactoringRequestCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = FintechService(db, current_user)
    # Note: Refactored to use invoice_id and amount from schema if needed, 
    # but for simplicity using model_dump if it matches
    repo = FactoringRepository(db, current_user=current_user)
    new_fact = FactoringModel(**fact_in.model_dump())
    created = await repo.create(new_fact)
    return GenericResponse(data=created)

@router.get("/insurance/{order_id}", response_model=GenericResponse[List[CargoInsurance]])
async def get_order_insurance(
    order_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InsuranceRepository(db, current_user=current_user)
    data = await repo.get_by_order(order_id)
    return GenericResponse(data=data)

@router.post("/insurance", response_model=GenericResponse[CargoInsurance])
async def create_cargo_insurance(
    ins_in: CargoInsuranceCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = InsuranceRepository(db, current_user=current_user)
    new_ins = InsuranceModel(**ins_in.model_dump())
    created = await repo.create(new_ins)
    return GenericResponse(data=created)

@router.get("/liquidity/{brand_id}", response_model=GenericResponse[Optional[BrandLiquidity]])
async def get_brand_liquidity(
    brand_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = LiquidityRepository(db, current_user=current_user)
    data = await repo.get_by_brand(brand_id)
    return GenericResponse(data=data)

@router.post("/liquidity", response_model=GenericResponse[BrandLiquidity])
async def report_liquidity(
    liq_in: BrandLiquidityCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = LiquidityRepository(db, current_user=current_user)
    new_liq = LiquidityModel(**liq_in.model_dump())
    created = await repo.create(new_liq)
    return GenericResponse(data=created)

@router.get("/costing/{sku_id}", response_model=GenericResponse[Optional[AdvancedCosting]])
async def get_advanced_costing(
    sku_id: str, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = AdvancedCostingRepository(db, current_user=current_user)
    data = await repo.get_by_sku(sku_id)
    return GenericResponse(data=data)

@router.post("/costing", response_model=GenericResponse[AdvancedCosting])
async def submit_advanced_costing(
    costing_in: AdvancedCostingCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = AdvancedCostingRepository(db, current_user=current_user)
    new_costing = CostingModel(**costing_in.model_dump())
    created = await repo.create(new_costing)
    return GenericResponse(data=created)

@router.get("/budgets/{brand_id}", response_model=GenericResponse[List[FinanceBudget]])
async def get_brand_budgets(
    brand_id: str, 
    season: Optional[str] = None, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = BudgetRepository(db, current_user=current_user)
    data = await repo.get_by_brand(brand_id, season)
    return GenericResponse(data=data)

@router.post("/budgets", response_model=GenericResponse[FinanceBudget])
async def create_budget(
    budget_in: FinanceBudgetCreate, 
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    repo = BudgetRepository(db, current_user=current_user)
    new_budget = BudgetModel(**budget_in.model_dump())
    created = await repo.create(new_budget)
    return GenericResponse(data=created)


# --- Payment (SBP / Acquiring) ---
from pydantic import BaseModel as PydanticBase


class PaymentCreateRequest(PydanticBase):
    amount_kopecks: int
    order_id: str
    description: str = ""
    return_url: str = "https://example.com/return"


@router.post("/payments/init", response_model=GenericResponse[dict])
async def init_payment(
    data: PaymentCreateRequest,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Create payment (Tinkoff/SBP when configured)."""
    from app.integrations.payment import PaymentClient
    client = PaymentClient()
    result = await client.create_payment(
        amount_kopecks=data.amount_kopecks,
        order_id=data.order_id,
        description=data.description,
        return_url=data.return_url,
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Payment init failed"))
    return GenericResponse(data=result)


@router.get("/payments/{payment_id}/status", response_model=GenericResponse[dict])
async def get_payment_status(
    payment_id: str,
    current_user: User = Depends(deps.get_current_active_user),
):
    """Get payment status."""
    from app.integrations.payment import PaymentClient
    client = PaymentClient()
    status = await client.get_payment_status(payment_id)
    return GenericResponse(data=status)
