from dataclasses import dataclass, asdict
from typing import Any

from app.core.project_registry import MODULE_REGISTRY, SECTION_REGISTRY


@dataclass(slots=True)
class ProjectHealthReport:
    total_sections: int
    total_modules: int
    existing_sections: int
    non_existing_sections: int
    ready_modules: int
    partial_modules: int
    missing_modules: int
    notes: list[str]


def build_project_health_report() -> dict[str, Any]:
    total_sections = len(SECTION_REGISTRY)
    total_modules = len(MODULE_REGISTRY)

    existing_sections = sum(1 for section in SECTION_REGISTRY.values() if section.is_existing)
    non_existing_sections = total_sections - existing_sections

    ready_modules = sum(1 for module in MODULE_REGISTRY.values() if module.status == "ready")
    partial_modules = sum(1 for module in MODULE_REGISTRY.values() if module.status == "partial")
    missing_modules = sum(1 for module in MODULE_REGISTRY.values() if module.status == "missing")

    notes = []

    if missing_modules > 0:
        notes.append("В проекте есть модули, которые зарегистрированы, но ещё не доведены до working state.")
    if partial_modules > 0:
        notes.append("Есть частично внедрённые модули, их надо стабилизировать перед следующим расширением.")
    if non_existing_sections > 0:
        notes.append("Часть sections пока только запланирована, но не представлена в текущем проекте.")

    report = ProjectHealthReport(
        total_sections=total_sections,
        total_modules=total_modules,
        existing_sections=existing_sections,
        non_existing_sections=non_existing_sections,
        ready_modules=ready_modules,
        partial_modules=partial_modules,
        missing_modules=missing_modules,
        notes=notes,
    )

    return asdict(report)
