import os
import re
from typing import List

class FeatureSuggestionAgent:
    def __init__(self, root_dir: str = ".", platform_name: str = "Synth-1 Fashion OS"):
        self.root_dir = os.path.abspath(root_dir)
        self.platform_name = platform_name
        self.suggestions: List[str] = []

    def analyze_missing_features(self) -> str:
        """Parses MASTER_PLAN for items not marked (РЕАЛИЗОВАНО), plus dir-structure gaps."""
        self.suggestions = [f"# Feature Suggestions for {self.platform_name}\n"]

        self._parse_master_plan()
        self._check_component_gaps()

        if len(self.suggestions) == 1:
            self.suggestions.append("- All MASTER_PLAN items implemented. Review for new opportunities.")
        return "\n".join(self.suggestions)

    def _parse_master_plan(self) -> None:
        mp_path = os.path.join(self.root_dir, "MASTER_PLAN.md")
        if not os.path.exists(mp_path):
            self.suggestions.append("- `MASTER_PLAN.md` not found. Cannot infer pending features.")
            return
        done_marker = re.compile(r"\(РЕАЛИЗОВАНО[^)]*\)", re.I)
        item_pattern = re.compile(r"^\d+\.\s+\*\*(.+?)\*\*:\s*(.+?)(?:\.|$)")
        pending: List[str] = []
        with open(mp_path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if done_marker.search(line):
                    continue
                m = item_pattern.match(line.strip())
                if m:
                    pending.append(f"  - **{m.group(1)}**: {m.group(2).strip()[:80]}")
        if pending:
            self.suggestions.append("## Pending from MASTER_PLAN (not yet РЕАЛИЗОВАНО)")
            self.suggestions.extend(pending[:20])
            if len(pending) > 20:
                self.suggestions.append(f"  - ... and {len(pending) - 20} more")

    def _check_component_gaps(self) -> None:
        modules = {"showroom": "Digital Showroom", "planning": "Assortment Planning", "wholesale": "Wholesale"}
        for base in ["synth-1/src", "synth-1/src/components", "synth-1/src/app"]:
            d = os.path.join(self.root_dir, base)
            if os.path.exists(d):
                content = str(os.listdir(d)).lower()
                for key, desc in modules.items():
                    if key not in content:
                        self.suggestions.append(f"- **Module Gap**: `{desc}` — consider adding `{key}`-related components.")
                break

    def generate_report(self, output_path: str = "feature_suggestions.md") -> str:
        content = self.analyze_missing_features()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
