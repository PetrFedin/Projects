from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.agents.context_loader import load_project_context

class DocsAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="DocsAgent",
            task_type="DOCS_QUERY",
            system_prompt="You are a Documentation Expert for the Synth-1 Fashion OS project. Use the provided context to answer accurately.",
            max_tokens=1000
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        ctx = context.get("docs_context") if context else None
        if not ctx:
            ctx = load_project_context()
        return f"Context:\n{ctx}\n\nQuestion: {task}\n\nAnswer based on the context above."

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.files_used = ["MASTER_PLAN.md", ".ai_context/project_overview.md"]
        res.next_step = "Apply documentation suggestions to code if needed"
        return res

docs_agent = DocsAgent()
