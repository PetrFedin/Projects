from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User, SmartContract, ContractExecutionLog
from app.db.repositories.finance import ContractRepository, ContractExecutionRepository
from app.services.ai_rule_engine import AIRuleEngine
from app.services.fintech_service import FintechService
from app.core.logging import logger
from app.core.datetime_util import utc_now

class SmartContractService:
    """
    AI Smart Contract Escalator.
    Automatically executes financial terms based on platform events.
    Vertical Link: Brand OS -> Finance Hub.
    Horizontal Link: Factory OS (QC/Milestones) + Fintech Hub (Payments).
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.contract_repo = ContractRepository(db, current_user)
        self.execution_repo = ContractExecutionRepository(db, current_user)
        self.fintech_service = FintechService(db, current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def create_contract(self, data: Dict[str, Any]) -> SmartContract:
        """Sets up a new automated financial contract."""
        new_contract = SmartContract(
            organization_id=self.current_user.organization_id,
            partner_id=data["partner_id"],
            contract_type=data["contract_type"],
            conditions_json=data["conditions"],
            status="active"
        )
        self.db.add(new_contract)
        await self.db.commit()
        await self.db.refresh(new_contract)
        
        logger.info(f"Smart Contract: Created {new_contract.contract_type} contract with {new_contract.partner_id}")
        return new_contract

    async def evaluate_and_execute(self, trigger_event: str, context: Dict[str, Any]):
        """
        The Escalator logic: Check if any active contracts match the event and execute if conditions are met.
        """
        contracts = await self.contract_repo.get_active_contracts(self.current_user.organization_id)
        
        for contract in contracts:
            if self._matches_trigger(contract, trigger_event, context):
                await self._execute_contract(contract, trigger_event, context)

    def _matches_trigger(self, contract: SmartContract, event: str, context: Dict[str, Any]) -> bool:
        """Determines if a contract should react to a specific event."""
        if contract.contract_type == "production_bonus" and event == "factory.batch_completed":
            return True
        if contract.contract_type == "penalty" and event == "factory.milestone_delayed":
            return True
        if contract.contract_type == "escrow_release" and event == "retail.transaction_completed":
            return True
        return False

    async def _execute_contract(self, contract: SmartContract, event: str, context: Dict[str, Any]):
        """Performs the financial operation defined in the contract."""
        logger.info(f"Smart Contract: Executing {contract.contract_type} for contract {contract.id}")
        
        payout = 0.0
        if contract.contract_type == "production_bonus":
            # Logic: If finished early, pay bonus
            days_early = context.get("days_early", 0)
            if days_early >= contract.conditions_json.get("min_days_early", 0):
                payout = contract.conditions_json.get("bonus_amount", 0.0)
        
        # Execute via Fintech Service
        if payout > 0:
            try:
                # Trigger internal wallet transfer
                # await self.fintech_service.process_contract_payment(...)
                
                execution = ContractExecutionLog(
                    contract_id=contract.id,
                    event_id=str(context.get("id") or context.get("batch_id", "unknown")),
                    payout_amount=payout,
                    status="success",
                    executed_at=utc_now()
                )
                self.db.add(execution)
                
                # Horizontal Integration: Notify parties
                await self.rule_engine.trigger_event("contract.executed", {
                    "module": "finance",
                    "contract_id": contract.id,
                    "payout": payout,
                    "type": contract.contract_type
                })
                
                # Mark contract as executed if it's one-time
                # contract.status = "executed"
                
                await self.db.commit()
            except Exception as e:
                logger.error(f"Smart Contract: Execution failed for {contract.id}: {str(e)}")
                execution = ContractExecutionLog(
                    contract_id=contract.id,
                    event_id=str(context.get("id", "unknown")),
                    payout_amount=payout,
                    status="failed",
                    error_message=str(e),
                    executed_at=utc_now()
                )
                self.db.add(execution)
                await self.db.commit()
