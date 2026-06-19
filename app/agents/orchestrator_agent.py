from typing import List, Optional, Dict
from app.core.logging import logger
from app.agents.agent_protocols import AgentResult, BaseAgent
from app.agents.docs_agent import docs_agent
from app.agents.code_agent import code_agent
from app.agents.review_agent import review_agent
from app.agents.bugfix_agent import bugfix_agent
from app.agents.product_architect_agent import product_architect_agent
from app.agents.market_intelligence_agent import market_intelligence_agent
from app.agents.quota_agent import quota_agent
from app.agents.roadmap_agent import roadmap_agent
from app.agents.content_agent import content_agent
from app.agents.risk_agent import risk_agent
from app.agents.creative_agents import lookbook_agent, stylist_agent

class OrchestratorAgent:
    def __init__(self):
        self.agent_name = "OrchestratorAgent"
        self.agents: Dict[str, BaseAgent] = {
            "DOCS_QUERY": docs_agent,
            "CODE_ITERATION": code_agent,
            "REVIEW_ITERATION": review_agent,
            "BUGFIX_ITERATION": bugfix_agent,
            "PRODUCT_ITERATION": product_architect_agent,
            "INTELLIGENCE_ITERATION": market_intelligence_agent,
            "QUOTA_ITERATION": quota_agent,
            "ROADMAP_ITERATION": roadmap_agent,
            "CONTENT_ITERATION": content_agent,
            "RISK_ITERATION": risk_agent,
            "LOOKBOOK_ITERATION": lookbook_agent,
            "STYLIST_ITERATION": stylist_agent
        }

    async def run(self, task_description: str, context: Optional[Dict] = None) -> AgentResult:
        ctx = context or {}
        from app.agents.stack_routing import agents_for_platform_context, pick_agent_for_task

        platform_agents = agents_for_platform_context(
            pillar=ctx.get("pillar"),
            role=ctx.get("role"),
            section_id=ctx.get("section_id"),
        )
        if platform_agents:
            logger.info(
                "Platform stack agents for pillar=%s role=%s section=%s: %s",
                ctx.get("pillar"),
                ctx.get("role"),
                ctx.get("section_id"),
                platform_agents,
            )
            preferred = pick_agent_for_task(
                task_description,
                pillar=ctx.get("pillar"),
                role=ctx.get("role"),
                section_id=ctx.get("section_id"),
            )
            ctx = {**ctx, "platform_agent_hint": preferred, "platform_agents": platform_agents}

        task_type = self._classify_task(task_description)
        logger.info(f"Orchestrator [Task: {task_description}] -> Task Type: {task_type}")
        agent = self.agents.get(task_type, docs_agent)
        return await agent.run(task_description, context=ctx)

    def _classify_task(self, task: str) -> str:
        t_low = task.lower()
        if any(w in t_low for w in ["lookbook", "curate", "collection", "curation"]):
            return "LOOKBOOK_ITERATION"
        if any(w in t_low for w in ["outfit", "stylist", "wear", "suggestion", "style me"]):
            return "STYLIST_ITERATION"
        if any(w in t_low for w in ["risk", "mitigation", "logistics", "supply chain"]):
            return "RISK_ITERATION"
        if any(w in t_low for w in ["content", "post", "copywrite", "social", "caption", "instagram"]):
            return "CONTENT_ITERATION"
        if any(w in t_low for w in ["roadmap", "update plan", "sync plan"]):
            return "ROADMAP_ITERATION"
        if any(w in t_low for w in ["quota", "allocate", "distribution", "assortment split"]):
            return "QUOTA_ITERATION"
        if any(w in t_low for w in ["competitor", "market", "joor", "nuorder", "faire", "benchmark"]):
            return "INTELLIGENCE_ITERATION"
        if any(w in t_low for w in ["review", "audit", "verify", "check", "inspect"]):
            return "REVIEW_ITERATION"
        if any(w in t_low for w in ["code", "implement", "create", "module", "add feature", "refactor"]):
            return "CODE_ITERATION"
        if any(w in t_low for w in ["fix", "bug", "error", "issue", "broken", "exception"]):
            return "BUGFIX_ITERATION"
        if any(w in t_low for w in ["explain", "where", "how", "what is", "document", "describe"]):
            return "DOCS_QUERY"
        if any(w in t_low for w in ["product", "sku", "design", "tech pack", "bom"]):
            return "PRODUCT_ITERATION"
        return "PRODUCT_ITERATION"

    def list_task_types(self) -> List[str]:
        return list(self.agents.keys())

orchestrator_agent = OrchestratorAgent()
