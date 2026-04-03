"""Shared context loading for agents."""
import os
from typing import Optional

def load_project_context(
    paths: Optional[list[str]] = None,
    max_chars: int = 6000,
) -> str:
    defaults = [
        "MASTER_PLAN.md",
        "ARCHITECTURE.md",
        ".ai_context/coding_rules.md",
        ".ai_context/project_overview.md",
    ]
    targets = paths or defaults
    parts = []
    for path in targets:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                chunk = min(len(content), max_chars // len(targets))
                parts.append(f"--- {path} ---\n{content[:chunk]}")
            except Exception:
                pass
    return "\n\n".join(parts) if parts else "No context files found."


def load_file_content(file_path: str, max_chars: int = 2000) -> str:
    """Load a specific file for code/review/bugfix context."""
    if not file_path or not os.path.exists(file_path):
        return ""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()[:max_chars]
    except Exception:
        return ""
