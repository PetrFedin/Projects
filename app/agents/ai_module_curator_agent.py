import os
import re
from typing import List, Set

class AIModuleCuratorAgent:
    REQUIRED = [
        "trend_radar", "visual_similarity", "assortment_ai", "demand_forecasting",
        "pricing_ai", "inventory_optimizer"
    ]

    def __init__(self, root_dir: str = "."):
        self.root_dir = os.path.abspath(root_dir)
        self.report: List[str] = []

    def evaluate_ai_stack(self) -> str:
        """Checks AI services: file existence, API wiring."""
        self.report = ["# AI Intelligence Layer Report\n"]
        ai_dir = os.path.join(self.root_dir, "app", "ai")
        services_dir = os.path.join(ai_dir, "services")
        routes_path = os.path.join(self.root_dir, "app", "api", "routes.py")
        ai_routes_path = os.path.join(self.root_dir, "app", "api", "v1", "endpoints", "ai_routes.py")

        existing = self._list_services(services_dir)
        wired = self._list_wired_services(routes_path, ai_routes_path)

        self._check_coverage(existing)
        self._check_wiring(existing, wired)

        if len(self.report) == 1:
            self.report.append("- AI stack coverage is complete and wired.")
        return "\n".join(self.report)

    def _list_services(self, services_dir: str) -> Set[str]:
        out: Set[str] = set()
        if os.path.exists(services_dir):
            for f in os.listdir(services_dir):
                if f.endswith(".py") and not f.startswith("__"):
                    out.add(f.replace(".py", "").replace("_service", "").replace("_", ""))
        return out

    def _list_wired_services(self, routes_path: str, ai_routes_path: str) -> Set[str]:
        wired: Set[str] = set()
        for path in [routes_path, ai_routes_path]:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read().lower()
                for s in self.REQUIRED:
                    name = s.replace("_", "")
                    if name in content or s in content:
                        wired.add(s)
        return wired

    def _check_coverage(self, existing: Set[str]) -> None:
        for s in self.REQUIRED:
            name = s.replace("_", "")
            if not any(name in ex for ex in existing):
                self.report.append(f"- **Coverage Gap**: `{s}` service not found in app/ai/services/.")

    def _check_wiring(self, existing: Set[str], wired: Set[str]) -> None:
        for s in self.REQUIRED:
            name = s.replace("_", "")
            has_file = any(name in ex for ex in existing)
            if has_file and s not in wired:
                self.report.append(f"- **Wiring**: `{s}` exists but may not be exposed in API. Check ai_routes.py.")

    def generate_report(self, output_path: str = "ai_intelligence_report.md") -> str:
        content = self.evaluate_ai_stack()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
