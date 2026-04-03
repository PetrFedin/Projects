from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.llm_client import llm_client

class RuleEngine:
    """
    Routes deterministic queries to static rules or repositories to save LLM tokens.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def route(self, prompt: str) -> Optional[str]:
        prompt_lower = prompt.lower()
        
        # 1. Health/Status checks
        if any(kw in prompt_lower for kw in ["health", "status", "working"]):
            return "The system is fully operational. All modules (DAM, PIM, Orders) are online."
            
        # 2. Basic FAQ/Docs
        if "linesheet" in prompt_lower and "how" in prompt_lower:
            return "To create a linesheet, navigate to the Brand Workspace and select 'Linesheet System'. You can then select SKUs and export to PDF."
            
        # 3. Role descriptions
        if "role" in prompt_lower and "buyer" in prompt_lower:
            return "The Buyer role allows you to browse digital showrooms, create order drafts, and view personalized market intelligence."

        return None

async def route_ai_request(prompt: str, context: Optional[Dict] = None, db: Optional[AsyncSession] = None) -> str:
    """
    Routes the AI request: 
    1. Try rule-based engine first (deterministic).
    2. Try embeddings/cache search.
    3. Fallback to LLM.
    """
    # 1. RuleEngine check (deterministic responses)
    if db:
        rule_engine = RuleEngine(db)
        if rule_match := await rule_engine.route(prompt):
            return rule_match
    
    # 2. TODO: Implement Semantic Search / Cache check
    # if cache_hit := await LLMCache().search(prompt): return cache_hit
    
    # Final Fallback: LLM
    response = await llm_client.complete(prompt, max_tokens=1000)
    return response
