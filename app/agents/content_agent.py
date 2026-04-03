from typing import Optional, List, Dict
from app.agents.agent_protocols import BaseAgent, AgentResult

class ContentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ContentAgent",
            task_type="CONTENT_ITERATION",
            system_prompt=(
                "You are an AI Marketing Copywriter for Synth-1 Fashion OS. Generate compelling content for fashion products. "
                "Include hashtags, emoji, platform-specific formatting (Instagram/TikTok). Tone: aspirational, brand-aligned."
            ),
            max_tokens=800,
            temperature=0.7
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        platform = context.get("platform", "generic") if context else "generic"
        content_type = context.get("content_type", "post") if context else "post"
        style = context.get("style_context", "Standard") if context else "Standard"
        
        return (
            f"Generate {content_type} for SKU {task} to be published on {platform}. "
            f"Style: {style}. "
            f"Provide the result as a text block."
        )

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.changes_proposed = [f"Marketing content generated for {task}"]
        res.code_changes = response # Reuse for generated text
        res.next_step = "Review and publish generated content"
        return res

content_agent = ContentAgent()
