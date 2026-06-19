"""Route backend agents by Platform Core pillar / role / section context."""

from __future__ import annotations

from app.platform.stack_registry import STACK_CAPABILITIES, get_capability_for_section


def agents_for_platform_context(
    *,
    pillar: str | None = None,
    role: str | None = None,
    section_id: str | None = None,
) -> list[str]:
    """Return agent_ids relevant to a Platform Core cell or section."""
    cap_ids = get_capability_for_section(section_id) if section_id else list(STACK_CAPABILITIES.keys())
    agents: set[str] = set()
    for cap_id in cap_ids:
        meta = STACK_CAPABILITIES[cap_id]
        if pillar and pillar not in meta["pillars"]:
            continue
        if role and role not in meta["roles"]:
            continue
        agents.update(meta["agent_ids"])
    if not agents and pillar and role:
        for meta in STACK_CAPABILITIES.values():
            if pillar in meta["pillars"] and role in meta["roles"]:
                agents.update(meta["agent_ids"])
    return sorted(agents)


def pick_agent_for_task(
    task_description: str,
    *,
    pillar: str | None = None,
    role: str | None = None,
    section_id: str | None = None,
    default: str = "docs",
) -> str:
    """Prefer platform-bound agents when context is provided."""
    bound = agents_for_platform_context(pillar=pillar, role=role, section_id=section_id)
    if not bound:
        return default
    t = task_description.lower()
    if any(w in t for w in ["catalog", "product", "sku", "linesheet", "showroom"]):
        for aid in ("product_architect", "market_intelligence", "content"):
            if aid in bound:
                return aid
    if any(w in t for w in ["payment", "stripe", "yukassa", "checkout"]):
        for aid in ("risk", "order_anomaly"):
            if aid in bound:
                return aid
    if any(w in t for w in ["ai", "llm", "ollama", "forecast", "pricing"]):
        for aid in ("ai_module_curator", "orchestrator", "market_intelligence"):
            if aid in bound:
                return aid
    return bound[0] if bound else default
