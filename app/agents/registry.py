"""
Реестр агентов — статус и модуль (детали процесса: docs/AGENT_REGISTRY.md).

Используется для документирования границ и будущей унификации вызовов.
"""

from __future__ import annotations

from enum import Enum
from typing import TypedDict


class AgentLifecycle(str, Enum):
    CORE = "core"
    PHASE_2 = "phase_2"
    EXPERIMENTAL = "experimental"
    DEPRECATED = "deprecated"


class AgentMeta(TypedDict):
    capability: str
    lifecycle: str
    module: str


# agent_id → метаданные (module — import path для ориентира)
AGENT_REGISTRY: dict[str, AgentMeta] = {
    "orchestrator": {
        "capability": "orchestration",
        "lifecycle": AgentLifecycle.CORE.value,
        "module": "app.agents.orchestrator_agent",
    },
    "review": {
        "capability": "code_review",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.review_agent",
    },
    "bugfix": {
        "capability": "remediation",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.bugfix_agent",
    },
    "docs": {
        "capability": "documentation",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.docs_agent",
    },
    "code": {
        "capability": "code_generation",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.code_agent",
    },
    "code_quality": {
        "capability": "quality_scan",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.code_quality_agent",
    },
    "content": {
        "capability": "content",
        "lifecycle": AgentLifecycle.EXPERIMENTAL.value,
        "module": "app.agents.content_agent",
    },
    "creative": {
        "capability": "creative",
        "lifecycle": AgentLifecycle.EXPERIMENTAL.value,
        "module": "app.agents.creative_agents",
    },
    "risk": {
        "capability": "risk",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.risk_agent",
    },
    "roadmap": {
        "capability": "roadmap",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.roadmap_agent",
    },
    "feature_suggestion": {
        "capability": "features",
        "lifecycle": AgentLifecycle.EXPERIMENTAL.value,
        "module": "app.agents.feature_suggestion_agent",
    },
    "market_intelligence": {
        "capability": "market_intel",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.market_intelligence_agent",
    },
    "order_anomaly": {
        "capability": "orders",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.order_anomaly_agent",
    },
    "quota": {
        "capability": "quota",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.quota_agent",
    },
    "ai_module_curator": {
        "capability": "ai_modules",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.ai_module_curator_agent",
    },
    "architecture_guard": {
        "capability": "architecture",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.architecture_guard_agent",
    },
    "product_architect": {
        "capability": "product_design",
        "lifecycle": AgentLifecycle.EXPERIMENTAL.value,
        "module": "app.agents.product_architect_agent",
    },
    "tech_debt": {
        "capability": "tech_debt",
        "lifecycle": AgentLifecycle.PHASE_2.value,
        "module": "app.agents.tech_debt_agent",
    },
    "ui_improvement": {
        "capability": "ui",
        "lifecycle": AgentLifecycle.EXPERIMENTAL.value,
        "module": "app.agents.ui_improvement_agent",
    },
}


def list_agents_by_lifecycle(lifecycle: AgentLifecycle) -> dict[str, AgentMeta]:
    return {k: v for k, v in AGENT_REGISTRY.items() if v["lifecycle"] == lifecycle.value}
