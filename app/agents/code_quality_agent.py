import os
import ast
from typing import List

class CodeQualityAgent:
    def __init__(self, target_dir: str = "app"):
        self.target_dir = target_dir
        self.report: List[str] = []

    def analyze(self) -> str:
        """Analyzes the codebase: long functions, cyclomatic complexity, ruff."""
        from datetime import datetime
        self.report = [f"# Code Quality Report\n\n*Generated: {datetime.now().isoformat()}*\n"]
        self._check_ruff()
        self._check_with_radon()
        self._check_long_functions()
        if len(self.report) == 1:
            self.report.append("- No major quality issues detected.")
        return "\n".join(self.report)

    def _check_ruff(self) -> None:
        import subprocess
        try:
            r = subprocess.run(
                ["ruff", "check", self.target_dir, "--output-format=concise"],
                capture_output=True, text=True, timeout=30
            )
            if r.returncode != 0 and r.stdout:
                lines = r.stdout.strip().split("\n")[:20]
                for line in lines:
                    self.report.append(f"- **Ruff**: {line}")
            if r.returncode != 0 and r.stdout and len(r.stdout.strip().split("\n")) > 20:
                self.report.append("  - ... run `ruff check app` for full output.")
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass

    def _check_with_radon(self) -> None:
        try:
            from radon.complexity import cc_visit
            for root, _, files in os.walk(self.target_dir):
                for f in files:
                    if f.endswith(".py"):
                        path = os.path.join(root, f)
                        try:
                            with open(path, "r", encoding="utf-8", errors="ignore") as fp:
                                code = fp.read()
                            for block in cc_visit(code):
                                if block.complexity > 10:
                                    self.report.append(
                                        f"- **High Complexity** (cc={block.complexity}): `{block.name}` in `{path}`. "
                                        "Consider refactoring."
                                    )
                        except Exception:
                            pass
        except ImportError:
            pass

    def _check_long_functions(self) -> None:
        for root, _, files in os.walk(self.target_dir):
            for f in files:
                if f.endswith(".py"):
                    path = os.path.join(root, f)
                    try:
                        with open(path, "r", encoding="utf-8", errors="ignore") as fp:
                            tree = ast.parse(fp.read())
                        for node in ast.walk(tree):
                            if isinstance(node, ast.FunctionDef):
                                if len(node.body) > 50:
                                    self.report.append(
                                        f"- **Long Function** ({len(node.body)} lines): `{node.name}` in `{path}`. "
                                        "Consider splitting."
                                    )
                    except Exception:
                        pass

    def generate_report(self, output_path: str = "code_quality_report.md") -> str:
        content = self.analyze()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
