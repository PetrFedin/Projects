from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.repositories.fintech import (
    InvestmentRepository, ContributionRepository, TransactionSplitRepository,
    InvoiceRepository, FactoringRepository, InsuranceRepository, LiquidityRepository, 
    AdvancedCostingRepository, BudgetRepository
)
from app.db.models.base import (
    InvestmentCampaign, InvestmentContribution, TransactionSplit, 
    Invoice, FactoringRequest, CargoInsurance, BrandLiquidity, 
    AdvancedCosting, FinanceBudget, User
)
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from datetime import datetime

class FintechService:
    """
    Unified Service for Brand Fintech: Escrow, BNPL, Factoring, and Wallet.
    Horizontal link: Connected to AIRuleEngine for payment confirmations and credit alerts.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.rule_engine = AIRuleEngine(db, current_user)
        
        # Repositories
        self.invest_repo = InvestmentRepository(db, current_user=current_user)
        self.contrib_repo = ContributionRepository(db, current_user=current_user)
        self.invoice_repo = InvoiceRepository(db, current_user=current_user)
        self.factoring_repo = FactoringRepository(db, current_user=current_user)
        self.budget_repo = BudgetRepository(db, current_user=current_user)

    # --- Invoicing & Payments ---
    async def create_invoice(self, data: Dict[str, Any]) -> Invoice:
        new_invoice = Invoice(**data)
        invoice = await self.invoice_repo.create(new_invoice)
        
        # Horizontal Integration: Trigger event for new invoice
        await self.rule_engine.trigger_event("fintech.invoice_created", {
            "module": "fintech",
            "id": invoice.id,
            "amount": invoice.amount,
            "currency": invoice.currency
        })
        return invoice

    # --- Factoring ---
    async def request_factoring(self, invoice_id: str, amount: float) -> FactoringRequest:
        new_request = FactoringRequest(
            invoice_id=invoice_id,
            requested_amount=amount,
            status="pending",
            organization_id=self.current_user.organization_id
        )
        fact = await self.factoring_repo.create(new_request)
        
        await self.rule_engine.trigger_event("fintech.factoring_requested", {
            "module": "fintech",
            "id": fact.id,
            "amount": amount
        })
        return fact

    # --- Crowdfunding / Investments ---
    async def invest_in_campaign(self, campaign_id: int, amount: float) -> InvestmentContribution:
        new_contrib = InvestmentContribution(
            campaign_id=campaign_id,
            investor_id=self.current_user.id,
            amount=amount,
            status="confirmed"
        )
        contrib = await self.contrib_repo.create(new_contrib)
        
        # Update campaign amount
        campaign = await self.invest_repo.get(campaign_id)
        if campaign:
            await self.invest_repo.update(campaign.id, current_amount=campaign.current_amount + amount)
            
            # Horizontal Integration: If goal reached, trigger task
            if campaign.current_amount >= campaign.target_amount:
                await self.rule_engine.trigger_event("fintech.campaign_goal_reached", {
                    "module": "fintech",
                    "id": campaign.id,
                    "title": campaign.title
                })
        
        return contrib
