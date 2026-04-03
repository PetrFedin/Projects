"""Run tests and linter on code. Used by feedback loop."""
import subprocess
import tempfile
from pathlib import Path
from typing import Any


def run_ruff_check(code: str, timeout: int = 30) -> tuple[bool, str]:
    """Run ruff on code string. Returns (passed, output)."""
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
            f.write(code)
            path = f.name
        r = subprocess.run(
            ["ruff", "check", path],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=Path(__file__).parent.parent.parent,
        )
        Path(path).unlink(missing_ok=True)
        return r.returncode == 0, r.stdout + r.stderr
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return False, str(e)


def run_mypy(paths: list[str] | None = None, timeout: int = 60) -> tuple[bool, str]:
    """Run mypy. paths: files/dirs to check, default app/."""
    try:
        args = ["mypy", "--no-error-summary", "--ignore-missing-imports"]
        args.extend(paths or ["app/"])
        r = subprocess.run(
            args, capture_output=True, text=True, timeout=timeout,
            cwd=Path(__file__).parent.parent.parent,
        )
        return r.returncode == 0, r.stdout + r.stderr
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return False, str(e)


def run_pytest(paths: list[str] | None = None, timeout: int = 120) -> tuple[bool, str]:
    """Run pytest on paths. paths: list of test files or directories."""
    try:
        args = ["pytest", "-q", "--tb=short"]
        if paths:
            args.extend(paths)
        else:
            args.append("tests/")
        r = subprocess.run(
            args,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=Path(__file__).parent.parent.parent,
        )
        return r.returncode == 0, r.stdout + r.stderr
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        return False, str(e)
