"""In-memory endpoint hit counter for usage audit. Opt-in via ENABLE_ENDPOINT_STATS."""

from collections import defaultdict
from typing import Dict

_endpoint_hits: Dict[str, int] = defaultdict(int)


def _normalize_path(path: str) -> str:
    """Group by API domain: /api/v1/orders/123 -> /api/v1/orders."""
    parts = [p for p in path.split("/") if p]
    if len(parts) >= 3:  # api, v1, domain
        return "/" + "/".join(parts[:3])
    return path


def record_hit(method: str, path: str) -> None:
    if not path.startswith("/api/"):
        return
    key = f"{method} {_normalize_path(path)}"
    _endpoint_hits[key] += 1


def get_stats() -> Dict[str, int]:
    return dict(sorted(_endpoint_hits.items(), key=lambda x: -x[1]))


def reset_stats() -> None:
    _endpoint_hits.clear()
