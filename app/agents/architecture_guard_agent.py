import os
import re
from typing import List, Tuple

class ArchitectureGuardAgent:
    RULES: List[Tuple[str, str, str]] = [
        ("app/agents", "from app.db.models", "Agents should not import db.models. Use services."),
        ("app/api", "from app.db.models", "API endpoints should not import db.models. Use services/repos."),
    ]

    def __init__(self, base_dir: str = "."):
        self.base_dir = os.path.abspath(base_dir)
        self.warnings: List[str] = []

    def check_boundaries(self) -> str:
        """Checks for architectural boundary violations."""
        self.warnings = ["# Architecture Report\n"]
        app_dir = os.path.join(self.base_dir, "app")
        if not os.path.exists(app_dir):
            self.warnings.append("- `app/` directory not found.")
            return "\n".join(self.warnings)

        for rule_dir, forbidden, msg in self.RULES:
            full_dir = os.path.join(self.base_dir, rule_dir)
            if os.path.exists(full_dir):
                for root, _, files in os.walk(full_dir):
                    for f in files:
                        if f.endswith(".py"):
                            path = os.path.join(root, f)
                            self._check_file(path, forbidden, msg)

        self._check_cyclic_imports()

        if len(self.warnings) == 1:
            self.warnings.append("- No architectural violations detected.")
        return "\n".join(self.warnings)

    def _check_cyclic_imports(self) -> None:
        import subprocess
        try:
            r = subprocess.run(
                ["python", "-c", "from app.main import app"],
                cwd=self.base_dir, capture_output=True, text=True, timeout=10
            )
            if r.returncode != 0:
                err = (r.stderr or r.stdout or "")[:500]
                self.warnings.append(f"- **Import Error**: App fails to import. Possible cyclic imports.\n  ```\n  {err}\n  ```")
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass

    def _check_file(self, path: str, forbidden: str, msg: str) -> None:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            if forbidden in content:
                rel = os.path.relpath(path, self.base_dir)
                self.warnings.append(f"- **Boundary Violation**: `{rel}` — {msg}")
        except Exception:
            pass

    def generate_report(self, output_path: str = "architecture_report.md") -> str:
        content = self.check_boundaries()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
