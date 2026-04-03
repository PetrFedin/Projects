from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult

class MarketIntelligenceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="MarketIntelligenceAgent",
            task_type="INTELLIGENCE_ITERATION",
            system_prompt="You are a Market Intelligence Analyst for Synth-1. Your goal is to gather and analyze competitor signals from JOOR, NuORDER, Faire, etc."
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        return (
            f"Analyze the market or specific competitor based on this request: {task}. "
            f"Identify a new competitor signal. Provide competitor_name, feature_name, signal_type, description, and priority."
        )

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.master_plan_updates = "Identified new market trends for competitive advantage."
        res.next_step = "Save competitor signal to database and alert Product Architect."
        return res

market_intelligence_agent = MarketIntelligenceAgent()
