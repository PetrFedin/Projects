from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.base import User, SupplyChainRisk, ProductionBatch, Order
from app.db.repositories.intelligence import SupplyChainRiskRepository
from app.services.ai_rule_engine import AIRuleEngine
from app.core.logging import logger
from datetime import datetime, timedelta

class SupplyChainService:
    """
    AI-driven Supply Chain Risk Management.
    Analyzes production and logistics to identify potential delays.
    Vertical Link: Brand OS Dashboard.
    Horizontal Link: Factory OS (Production) + Logistics.
    """
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user
        self.repo = SupplyChainRiskRepository(db, current_user)
        self.rule_engine = AIRuleEngine(db, current_user)

    async def analyze_batch_risk(self, batch_id: str) -> Dict[str, Any]:
        """AI analysis of a specific production batch for delay risks."""
        # Simulated risk analysis logic
        # In a real system, this would fetch actual data from ProductionBatch and MachineTelemetry
        risk_level = "medium"
        delay_est = 4
        
        risk_entry = SupplyChainRisk(
            organization_id=self.current_user.organization_id,
            batch_id=batch_id,
            risk_type="production_delay",
            severity=risk_level,
            impact_description=f"Predicted delay of {delay_est} days due to machine maintenance queue.",
            estimated_delay_days=delay_est,
            mitigation_suggestions_json={
                "suggestions": [
                    "Reallocate 20% of volume to Factory B",
                    "Switch to air freight for final delivery to offset production delay"
                ]
            }
        )
        self.db.add(risk_entry)
        await self.db.commit()
        
        # Horizontal Integration: If risk is high/critical, trigger a task for the Brand Manager
        if risk_level in ["high", "critical"]:
            await self.rule_engine.trigger_event("supply_chain.high_risk_detected", {
                "module": "supply_chain",
                "id": batch_id,
                "severity": risk_level,
                "delay": delay_est
            })
            
        return {
            "batch_id": batch_id,
            "risk_level": risk_level,
            "estimated_delay": delay_est,
            "impact": risk_entry.impact_description,
            "mitigation": risk_entry.mitigation_suggestions_json["suggestions"]
        }

    async def get_active_risks(self) -> List[SupplyChainRisk]:
        return await self.repo.get_active_risks(self.current_user.organization_id)

    async def mitigate_risk(self, risk_id: int, action: str):
        risk = await self.repo.get_by_id(risk_id)
        if risk:
            risk.status = "mitigated"
            await self.db.commit()
            # Log action
            logger.info(f"Supply Chain: Risk {risk_id} mitigated by action: {action}")
