"""Platform Core stack — capability registry mapped to pillars, roles, sections, agents."""

from app.platform.stack_registry import (
    STACK_CAPABILITIES,
    StackCapabilityId,
    get_agents_for_capability,
    get_capability_for_section,
    get_sections_for_capability,
)

__all__ = [
    "STACK_CAPABILITIES",
    "StackCapabilityId",
    "get_agents_for_capability",
    "get_capability_for_section",
    "get_sections_for_capability",
]
