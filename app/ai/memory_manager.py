"""Context persistence for AI workflows. In-memory fallback, DB TODO."""
import time
from typing import Any, Optional

# In-memory store (per-process). TODO: persist to DB.
_memory: dict[tuple[str, str], tuple[Any, float]] = {}
_MAX_ITEMS = 500
_MAX_CONTEXT_CHARS = 4000


class MemoryManager:
    """Handles context persistence for AI-driven workflows."""

    def __init__(self, db: Any = None):
        self.db = db

    async def store_context(self, user_id: str, context_key: str, data: Any) -> None:
        global _memory
        if len(_memory) >= _MAX_ITEMS:
            oldest = min(_memory.items(), key=lambda x: x[1][1])
            del _memory[oldest[0]]
        _memory[(user_id, context_key)] = (data, time.time())

    async def get_context(self, user_id: str, context_key: str) -> Optional[Any]:
        return _memory.get((user_id, context_key), (None, 0))[0]

    async def summarize_context(self, context_data: list[Any]) -> str:
        """Truncate for token efficiency. TODO: LLM summarization."""
        if not context_data:
            return ""
        text = "\n".join(str(x) for x in context_data)
        return text[: _MAX_CONTEXT_CHARS] + ("..." if len(text) > _MAX_CONTEXT_CHARS else "")
