from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.agents.context_loader import load_project_context, load_file_content

class ReviewAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ReviewAgent",
            task_type="REVIEW_ITERATION",
            system_prompt="You are a Senior Code Reviewer for Synth-1. Check: duplication, cyclomatic complexity, ARCHITECTURE compliance, security, error handling.",
            max_tokens=1200
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        ctx = context.get("review_context") if context else load_project_context()
        files = context.get("file_paths", []) if context else []
        code = "\n\n".join(
            f"--- {p} ---\n{load_file_content(p)}" for p in files[:5]
        ) if files else f"(No files specified. Review scope: {task})"
        return f"Architecture:\n{ctx[:3000]}\n\nCode to review:\n{code}\n\nReview task: {task}\n\nList issues with severity and suggested fixes."

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.next_step = "Fix identified issues"
        return res

review_agent = ReviewAgent()
