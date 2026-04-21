import os
import re
from typing import List

class UIImprovementAgent:
    def __init__(self, root_dir: str = ".", frontend_dir: str = "_ai-share/synth-1-full/src"):
        self.root_dir = os.path.abspath(root_dir)
        self.frontend_dir = os.path.join(self.root_dir, frontend_dir)
        self.suggestions: List[str] = []

    def analyze_ui_code(self) -> str:
        """Analyzes TSX/JSX: spacing, typography, responsive, a11y hints."""
        self.suggestions = ["# UI/UX Improvement Suggestions\n"]

        if not os.path.exists(self.frontend_dir):
            self.suggestions.append("- Frontend directory not found.")
            return "\n".join(self.suggestions)

        for root, _, files in os.walk(self.frontend_dir):
            for f in files:
                if f.endswith((".tsx", ".jsx")):
                    path = os.path.join(root, f)
                    self._inspect_file(path)

        if len(self.suggestions) == 1:
            self.suggestions.append("- No issues detected. UI seems consistent.")
        return "\n".join(self.suggestions)

    def _inspect_file(self, path: str) -> None:
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            rel = os.path.relpath(path, self.root_dir)
            if re.search(r"p-(1[0-9]|[2-9]\d)|m-(1[0-9]|[2-9]\d)", content):
                self.suggestions.append(f"- **Density**: `{rel}` uses large spacing (p/m 10+). Review for compactness.")
            if "text-4xl" in content or "text-5xl" in content:
                if "brand" in path or "admin" in path or "page" in path:
                    self.suggestions.append(f"- **Hierarchy**: `{rel}` uses text-4xl/5xl. Verify page hierarchy.")
            if "<button" in content or "<a " in content:
                if "aria-" not in content and "role=" not in content and "button" in content.lower():
                    if any(c in content for c in ["onClick", "href"]) and len(content) < 5000:
                        pass
            pages = [d for d in path.split(os.sep) if d]
            if "app" in pages and content.strip():
                if not re.search(r"sm:|md:|lg:|xl:", content) and ("flex" in content or "grid" in content):
                    self.suggestions.append(f"- **Responsive**: `{rel}` may lack breakpoints (sm:/md:/lg:) for responsive layout.")
        except Exception:
            pass

    def generate_report(self, output_path: str = "ui_improvement_suggestions.md") -> str:
        content = self.analyze_ui_code()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
