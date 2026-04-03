from typing import Optional, List
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.core.logging import logger

class RoadmapAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RoadmapAgent",
            task_type="ROADMAP_ITERATION",
            system_prompt=(
                "You are the Product Architect of Synth-1. Your task is to keep MASTER_PLAN.md synchronized with TASK_QUEUE.md. "
                "You analyze completed tasks and update the roadmap, adding (DONE) marks and updating the implementation registry."
            )
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        task_queue = context.get("task_queue", "") if context else ""
        master_plan = context.get("master_plan", "") if context else ""
        
        return (
            f"Analyze the completed tasks in TASK_QUEUE.md:\n\n{task_queue}\n\n"
            f"And update the following MASTER_PLAN.md content accordingly:\n\n{master_plan}\n\n"
            "Return the FULL updated MASTER_PLAN.md content. Ensure all (DONE) marks are accurate."
        )

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.changes_proposed = ["MASTER_PLAN.md updated to reflect latest progress"]
        res.code_changes = response # The full updated content
        res.next_step = "Review the updated roadmap and commit changes"
        return res

roadmap_agent = RoadmapAgent()
