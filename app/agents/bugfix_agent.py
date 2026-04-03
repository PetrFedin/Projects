from typing import Optional
from app.agents.agent_protocols import BaseAgent, AgentResult
from app.agents.context_loader import load_file_content

class BugfixAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="BugfixAgent",
            task_type="BUGFIX_ITERATION",
            system_prompt="You are a Bugfix Engineer for Synth-1. Provide minimal, targeted fixes. Include file path and exact code change.",
            max_tokens=1200
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        files = context.get("file_paths", []) if context else []
        stack = context.get("stack_trace", "") if context else ""
        code = "\n\n".join(
            f"--- {p} ---\n{load_file_content(p)}" for p in files[:3]
        ) if files else ""
        extra = f"\nStack trace:\n{stack}" if stack else ""
        feedback_block = self._format_feedback(context)
        return f"Issue: {task}{extra}\n\nRelevant code:\n{code}\n\n{feedback_block}\n\nProvide minimal fix. Format: FILE_PATH, BEFORE, AFTER."

    def _format_feedback(self, context: Optional[dict]) -> str:
        examples = (context or {}).get("feedback_examples", [])
        if not examples:
            return ""
        parts = ["Similar successful fixes from past runs:"]
        for i, ex in enumerate(examples[:3], 1):
            parts.append(f"[{i}] Task: {ex.get('task', '')[:200]}")
            parts.append(f"    Fix: {ex.get('code_changes', '')[:500]}...")
        return "\n".join(parts)

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.code_changes = response
        res.next_step = "Run tests to verify the fix"
        return res

bugfix_agent = BugfixAgent()
