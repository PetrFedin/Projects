"""UTC datetime helper to replace deprecated datetime.utcnow()."""
from datetime import datetime, timezone

def utc_now() -> datetime:
    return datetime.now(timezone.utc)
