import os
import re
import subprocess
from typing import List

class TechDebtAgent:
    def __init__(self, root_dir: str = "."):
        self.root_dir = os.path.abspath(root_dir)
        self.debt_items: List[str] = []

    def detect_debt(self) -> str:
        """Identifies tech debt: tests, docs, TODOs, outdated deps, coverage."""
        from datetime import datetime
        self.debt_items = [f"# Technical Debt Report\n\n*Generated: {datetime.now().isoformat()}*\n"]

        self._check_tests_dir()
        self._check_documentation()
        self._check_todo_fixme()
        self._check_test_coverage()
        self._check_outdated_deps()
        self._check_pip_audit()

        return "\n".join(self.debt_items)

    def _check_pip_audit(self) -> None:
        try:
            r = subprocess.run(
                ["pip", "audit"],
                cwd=self.root_dir, capture_output=True, text=True, timeout=30
            )
            if r.returncode != 0 and r.stderr:
                vulns = [l for l in r.stderr.split("\n") if "Vulnerable" in l or "known" in l]
                if vulns:
                    self.debt_items.append("- **Security**: pip-audit found vulnerabilities. Run `pip audit`.")
        except FileNotFoundError:
            pass
        except Exception:
            pass

    def _check_tests_dir(self) -> None:
        test_dir = os.path.join(self.root_dir, "tests")
        if not os.path.exists(test_dir):
            self.debt_items.append("- **Critical Debt**: `tests/` directory is missing. Code coverage is 0%.")
        else:
            py_files = sum(1 for r, _, f in os.walk(test_dir) for x in f if x.endswith(".py") and not x.startswith("__"))
            if py_files == 0:
                self.debt_items.append("- **Critical Debt**: `tests/` exists but contains no test files.")

    def _check_documentation(self) -> None:
        docs = ["ARCHITECTURE.md", "README.md"]
        for doc in docs:
            if not os.path.exists(os.path.join(self.root_dir, doc)):
                self.debt_items.append(f"- **Documentation Debt**: `{doc}` is missing.")

    def _check_todo_fixme(self) -> None:
        pattern = re.compile(r"#\s*(TODO|FIXME|XXX|HACK)(?:\s*[:\-])?\s*(.+)", re.I)
        findings: List[str] = []
        app_dir = os.path.join(self.root_dir, "app")
        if os.path.exists(app_dir):
            for root, _, files in os.walk(app_dir):
                for f in files:
                    if f.endswith(".py"):
                        path = os.path.join(root, f)
                        try:
                            with open(path, "r", encoding="utf-8", errors="ignore") as fp:
                                for i, line in enumerate(fp, 1):
                                    m = pattern.search(line)
                                    if m:
                                        rel = os.path.relpath(path, self.root_dir)
                                        findings.append(f"  - `{rel}:{i}` {m.group(1)}: {m.group(2).strip()[:60]}")
                        except Exception:
                            pass
        if findings:
            self.debt_items.append("- **Tech Debt Markers**: TODO/FIXME/XXX found:")
            self.debt_items.extend(findings[:15])
            if len(findings) > 15:
                self.debt_items.append(f"  - ... and {len(findings) - 15} more")

    def _check_test_coverage(self) -> None:
        try:
            r = subprocess.run(
                ["pytest", "tests/", "--cov=app", "--cov-report=term-missing", "--no-header", "-q"],
                cwd=self.root_dir, capture_output=True, text=True, timeout=60
            )
            if r.returncode == 0 and r.stdout:
                for line in r.stdout.split("\n"):
                    if "TOTAL" in line and "%" in line:
                        self.debt_items.append(f"- **Test Coverage**: {line.strip()}")
                        break
        except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
            self.debt_items.append("- **Test Coverage**: Run `pytest --cov=app` manually to check coverage.")

    def _check_outdated_deps(self) -> None:
        try:
            r = subprocess.run(
                ["pip", "list", "--outdated"],
                cwd=self.root_dir, capture_output=True, text=True, timeout=15
            )
            if r.returncode == 0 and r.stdout:
                lines = [l for l in r.stdout.strip().split("\n")[2:] if l]
                count = len(lines)
                if count > 0:
                    self.debt_items.append(f"- **Outdated Dependencies**: {count} packages have newer versions. Run `pip list --outdated`.")
        except Exception:
            pass

    def generate_report(self, output_path: str = "tech_debt_report.md") -> str:
        content = self.detect_debt()
        d = os.path.dirname(output_path)
        if d:
            os.makedirs(d, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path
