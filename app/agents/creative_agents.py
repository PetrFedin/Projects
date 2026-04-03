from typing import Optional, List, Dict
from app.agents.agent_protocols import BaseAgent, AgentResult

class LookbookAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="LookbookAgent",
            task_type="LOOKBOOK_ITERATION",
            system_prompt=(
                "You are an AI Fashion Creative Director for Synth-1. Your goal is to curate stunning lookbooks. "
                "You combine items into outfits and write an inspiring AI Story for the collection."
            ),
            max_tokens=1000,
            temperature=0.8
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        skus = context.get("skus", []) if context else []
        season = context.get("season", "Current") if context else "Current"
        style = context.get("style_context", "Modern") if context else "Standard"
        
        return (
            f"Curate a lookbook for brand {task} for {season} season. "
            f"Items to use (SKUs): {', '.join(skus)}. "
            f"Style: {style}. "
            f"Propose 3 outfits and write a 2-paragraph AI Story for this lookbook."
        )

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.changes_proposed = [f"Lookbook curated for {task}"]
        res.code_changes = response # Use for AI Story and curation notes
        res.next_step = "Review curation and publish lookbook"
        return res

lookbook_agent = LookbookAgent()

class StylistAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="StylistAgent",
            task_type="STYLIST_ITERATION",
            system_prompt=(
                "You are an AI Personal Stylist for Synth-1. You know the user's wardrobe and suggest perfect outfits "
                "based on the occasion and weather."
            ),
            max_tokens=600,
            temperature=0.7
        )

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        occasion = context.get("occasion", "General") if context else "General"
        weather = context.get("weather_context", "Clear") if context else "Clear"
        wardrobe = context.get("wardrobe_skus", []) if context else []
        
        return (
            f"Suggest an outfit for user {task} for {occasion}. "
            f"Weather: {weather}. "
            f"Items available in wardrobe (SKUs): {', '.join(wardrobe)}. "
            f"Provide a stylish recommendation."
        )

    def _format_result(self, task: str, response: str) -> AgentResult:
        res = super()._format_result(task, response)
        res.changes_proposed = [f"Outfit suggested for {task}"]
        res.code_changes = response # Use for recommendation text
        res.next_step = "User reviews recommendation"
        return res

stylist_agent = StylistAgent()
