from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.agents.context_loader import load_project_context

class ProductArchitectAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ProductArchitectAgent",
            task_type="PRODUCT_ITERATION",
            system_prompt="You are Product Architect for Synth-1 Fashion OS. Propose features with: name, category, problem, solution, business_value, priority (1-5). Align with MASTER_PLAN.",
            max_tokens=1000
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        ctx = context.get("product_context") if context else load_project_context()
        return f"Current roadmap:\n{ctx[:4000]}\n\nRequest: {task}\n\nPropose feature as JSON: name, category, problem, solution, business_value, priority."

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.master_plan_updates = "Proposed new feature addition to MASTER_PLAN.md"
        res.next_step = "Save feature proposal to database and update TASK_QUEUE.md"
        return res

product_architect_agent = ProductArchitectAgent()
