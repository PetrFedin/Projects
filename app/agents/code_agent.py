from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.agents.context_loader import load_project_context, load_file_content

class CodeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CodeAgent",
            task_type="CODE_ITERATION",
            system_prompt="You are a Principal Software Engineer for Synth-1 Fashion OS. Follow coding rules and ARCHITECTURE. Output valid Python/TypeScript code.",
            max_tokens=2000
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        ctx = context.get("code_context") if context else load_project_context()
        files = context.get("file_paths", []) if context else []
        code_snippets = "\n\n".join(
            f"--- {p} ---\n{load_file_content(p)}" for p in files[:3]
        ) if files else ""
        feedback_block = self._format_feedback(context)
        return f"Project context:\n{ctx}\n\n{code_snippets}\n\n{feedback_block}\n\nTask: {task}\n\nProvide implementation. Include file path if relevant."

    def _format_feedback(self, context: Optional[dict]) -> str:
        examples = (context or {}).get("feedback_examples", [])
        if not examples:
            return ""
        parts = ["Similar successful changes from past runs:"]
        for i, ex in enumerate(examples[:3], 1):
            parts.append(f"[{i}] Task: {ex.get('task', '')[:200]}")
            parts.append(f"    Changes: {ex.get('code_changes', '')[:500]}...")
        return "\n".join(parts)

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.code_changes = response
        res.next_step = "Review the generated code"
        return res

code_agent = CodeAgent()
