from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class FinanceBudget(Base):
    __tablename__ = "finance_budgets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String)
    budget_type: Mapped[str] = mapped_column(String) # raw_material, production
    limit_amount: Mapped[float] = mapped_column(Float)
    spent_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class AdvancedCosting(Base):
    __tablename__ = "advanced_costings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    fabric_cost: Mapped[float] = mapped_column(Float, default=0.0)
    trim_cost: Mapped[float] = mapped_column(Float, default=0.0)
    labor_cost: Mapped[float] = mapped_column(Float, default=0.0)
    logistics_cost: Mapped[float] = mapped_column(Float, default=0.0)
    marketing_allocation: Mapped[float] = mapped_column(Float, default=0.0)
    overhead_allocation: Mapped[float] = mapped_column(Float, default=0.0)
    duty_cost: Mapped[float] = mapped_column(Float, default=0.0)
    total_landed_cost: Mapped[float] = mapped_column(Float, default=0.0)
    target_retail_price: Mapped[float] = mapped_column(Float, default=0.0)
    projected_margin: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class FactoringRequest(Base):
    __tablename__ = "factoring_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_id: Mapped[int] = mapped_column(Integer, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(Float)
    fee_percentage: Mapped[float] = mapped_column(Float)
    ai_risk_score: Mapped[float] = mapped_column(Float) # 0.0 to 1.0 (lower is better)
    status: Mapped[str] = mapped_column(String, default="requested") # requested, approved, paid, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class CargoInsurance(Base):
    __tablename__ = "cargo_insurances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    policy_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    insured_amount: Mapped[float] = mapped_column(Float)
    premium_cost: Mapped[float] = mapped_column(Float)
    carrier_id: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="active") # active, expired, claimed
    policy_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class BrandLiquidity(Base):
    __tablename__ = "brand_liquidity"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    cash_on_hand: Mapped[float] = mapped_column(Float)
    accounts_receivable: Mapped[float] = mapped_column(Float)
    accounts_payable: Mapped[float] = mapped_column(Float)
    inventory_value: Mapped[float] = mapped_column(Float)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class CreditLimit(Base):
    __tablename__ = "credit_limits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    total_limit: Mapped[float] = mapped_column(Float, default=0.0)
    used_amount: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")
    is_active: Mapped[bool] = mapped_column(default=True)
    payment_terms_days: Mapped[int] = mapped_column(Integer, default=30)  # Net 30/60/90 (Faire, Brandboom)

class SeasonalCredit(Base):
    __tablename__ = "seasonal_credits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String)
    credit_amount: Mapped[float] = mapped_column(Float, default=0.0)
    expiry_date: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class InvestmentCampaign(Base):
    __tablename__ = "investment_campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    target_amount: Mapped[float] = mapped_column(default=0.0)
    current_amount: Mapped[float] = mapped_column(default=0.0)
    equity_offered: Mapped[float] = mapped_column(default=0.0) # In % or profit share
    status: Mapped[str] = mapped_column(String, default="active") # active, closed, funded
    end_date: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class InvestmentContribution(Base):
    __tablename__ = "investment_contributions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    campaign_id: Mapped[int] = mapped_column(Integer, index=True)
    investor_id: Mapped[str] = mapped_column(String, index=True)
    amount: Mapped[float] = mapped_column(default=0.0)
    contribution_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True) # Basic, Premium, etc.
    price_monthly: Mapped[float] = mapped_column(Float)
    items_limit: Mapped[int] = mapped_column(Integer)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class SmartContract(Base):
    __tablename__ = "smart_contracts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    partner_id: Mapped[str] = mapped_column(String, index=True) # Factory or Distributor
    contract_type: Mapped[str] = mapped_column(String) # production_bonus, penalty, escrow_release
    conditions_json: Mapped[dict] = mapped_column(JSON) # e.g., {"days_early": 5, "bonus": 500}
    status: Mapped[str] = mapped_column(String, default="active") # active, executed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ProductionPaymentSchedule(Base):
    """Payment calendar for production batches."""
    __tablename__ = "production_payments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    milestone_name: Mapped[str] = mapped_column(String) # e.g., "Advance for fabric", "Final payment"
    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    due_date: Mapped[datetime] = mapped_column(DateTime)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending") # pending, paid, overdue

class CustomsPayment(Base):
    """VED/ВЭД payments for international production."""
    __tablename__ = "customs_payments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[str] = mapped_column(String, index=True)
    duty_amount: Mapped[float] = mapped_column(Float)
    vat_amount: Mapped[float] = mapped_column(Float)
    broker_fee: Mapped[float] = mapped_column(Float)
    total_rub: Mapped[float] = mapped_column(Float)
    exchange_rate: Mapped[float] = mapped_column(Float)
    cleared_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class ContractExecutionLog(Base):
    __tablename__ = "contract_execution_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    contract_id: Mapped[int] = mapped_column(Integer, index=True)
    event_id: Mapped[str] = mapped_column(String, index=True) # Link to trigger event
    payout_amount: Mapped[float] = mapped_column(Float)
    transaction_id: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Link to Fintech Hub
    status: Mapped[str] = mapped_column(String) # success, failed
    error_message: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    executed_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
