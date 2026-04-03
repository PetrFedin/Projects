from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class InvestmentCampaignBase(BaseModel):
    brand_id: str
    title: str
    description: str
    target_amount: float
    equity_offered: float
    end_date: datetime
    status: str = "active"

class InvestmentCampaignCreate(InvestmentCampaignBase):
    pass

class InvestmentCampaign(InvestmentCampaignBase):
    id: int
    current_amount: float
    created_at: datetime

    model_config = {"from_attributes": True}

class ContributionCreate(BaseModel):
    campaign_id: int
    investor_id: str
    amount: float

class Contribution(ContributionCreate):
    id: int
    contribution_date: datetime

    model_config = {"from_attributes": True}

class CampaignStatusUpdate(BaseModel):
    status: str

class TransactionSplitBase(BaseModel):
    transaction_id: str
    brand_share: float = 0.0
    factory_share: float = 0.0
    logistics_share: float = 0.0
    platform_fee: float = 0.0
    status: str = "pending"

class TransactionSplitCreate(TransactionSplitBase):
    pass

class TransactionSplit(TransactionSplitBase):
    id: int
    model_config = {"from_attributes": True}

class InvoiceBase(BaseModel):
    invoice_number: str
    order_id: str
    amount: float
    currency: str = "USD"
    conversion_rate_to_usd: float = 1.0
    status: str = "pending"

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class FactoringRequestBase(BaseModel):
    invoice_id: int
    partner_id: str
    amount: float
    fee_percentage: float
    ai_risk_score: float = 0.0
    status: str = "requested"

class FactoringRequestCreate(FactoringRequestBase):
    pass

class FactoringRequest(FactoringRequestBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}

class CargoInsuranceBase(BaseModel):
    order_id: str
    policy_number: str
    insured_amount: float
    premium_cost: float
    carrier_id: str
    status: str = "active"
    policy_url: Optional[str] = None

class CargoInsuranceCreate(CargoInsuranceBase):
    pass

class CargoInsurance(CargoInsuranceBase):
    id: int
    model_config = {"from_attributes": True}

class BrandLiquidityBase(BaseModel):
    brand_id: str
    cash_on_hand: float
    accounts_receivable: float
    accounts_payable: float
    inventory_value: float

class BrandLiquidityCreate(BrandLiquidityBase):
    pass

class BrandLiquidity(BrandLiquidityBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class AdvancedCostingBase(BaseModel):
    sku_id: str
    fabric_cost: float = 0.0
    trim_cost: float = 0.0
    labor_cost: float = 0.0
    logistics_cost: float = 0.0
    marketing_allocation: float = 0.0
    overhead_allocation: float = 0.0
    duty_cost: float = 0.0
    total_landed_cost: float = 0.0
    target_retail_price: float = 0.0
    projected_margin: float = 0.0

class AdvancedCostingCreate(AdvancedCostingBase):
    pass

class AdvancedCosting(AdvancedCostingBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}

class FinanceBudgetBase(BaseModel):
    brand_id: str
    season: str
    budget_type: str
    limit_amount: float
    spent_amount: float = 0.0
    currency: str = "USD"

class FinanceBudgetCreate(FinanceBudgetBase):
    pass

class FinanceBudget(FinanceBudgetBase):
    id: int
    updated_at: datetime
    model_config = {"from_attributes": True}
