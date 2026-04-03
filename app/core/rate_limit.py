"""Simple in-memory rate limiter for AI endpoints."""
import time
from collections import defaultdict
from typing import Optional

_window: dict[str, list[float]] = defaultdict(list)
_DEFAULT_LIMIT = 10
_DEFAULT_WINDOW = 60  # seconds


def check_rate_limit(key: str, limit: int = _DEFAULT_LIMIT, window_sec: int = _DEFAULT_WINDOW) -> bool:
    """Returns True if allowed, False if rate limited."""
    now = time.time()
    cutoff = now - window_sec
    _window[key] = [t for t in _window[key] if t > cutoff]
    if len(_window[key]) >= limit:
        return False
    _window[key].append(now)
    return True


def get_remaining(key: str, limit: int = _DEFAULT_LIMIT, window_sec: int = _DEFAULT_WINDOW) -> int:
    now = time.time()
    cutoff = now - window_sec
    _window[key] = [t for t in _window[key] if t > cutoff]
    return max(0, limit - len(_window[key]))
