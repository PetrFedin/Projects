"""UTC datetime helper to replace deprecated datetime.utcnow()."""
from datetime import datetime, timezone

def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_now_naive() -> datetime:
    """Naive UTC for PostgreSQL TIMESTAMP WITHOUT TIME ZONE columns."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
