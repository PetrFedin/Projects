"""
Realtime — SSE streaming and notifications feed.
Used when WebSocket (NEXT_PUBLIC_WS_URL) is not available.
Integrates with event bus / Redis Pub-Sub in production.
"""
import asyncio
import json
from app.core.datetime_util import utc_now
from typing import AsyncGenerator

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# In-memory event queue; in production use Redis Pub/Sub or similar
_realtime_queue: asyncio.Queue = asyncio.Queue(maxsize=1000)


def push_realtime_event(event: dict) -> None:
    """Push event to SSE stream. Call from other services (orders, QC, EDO)."""
    try:
        _realtime_queue.put_nowait(event)
    except asyncio.QueueFull:
        pass


@router.get("/events")
async def sse_events(request: Request):
    """
    SSE stream for real-time events (order, qc, edo, sla, payment).
    In production: wire to Redis Pub/Sub or external WS gateway.
    """
    async def event_stream() -> AsyncGenerator[str, None]:
        while True:
            if request.is_disconnected():
                break
            try:
                event = await asyncio.wait_for(_realtime_queue.get(), timeout=30.0)
                payload = {
                    "type": event.get("type", "system"),
                    "title": event.get("title", ""),
                    "body": event.get("body"),
                    "href": event.get("href"),
                    "ts": utc_now().isoformat(),
                    **{k: v for k, v in event.items() if k not in ("type", "title", "body", "href")},
                }
                yield f"data: {json.dumps(payload)}\n\n"
            except asyncio.TimeoutError:
                yield f"data: {json.dumps({'type': 'ping', 'ts': utc_now().isoformat()})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
