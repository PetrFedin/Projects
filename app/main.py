import asyncio
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.api import routes
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import SynthBaseException
from app.core.endpoint_stats import record_hit

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="0.1.0",
        description="B2B Fashion Platform API: PLM, Wholesale, DAM, AI agents, Retail.",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
    )
    
    cors_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins or ["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Standard Middleware for Request ID and Logging
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        start_time = time.time()
        if settings.ENABLE_ENDPOINT_STATS:
            record_hit(request.method, request.url.path)

        response = await call_next(request)

        process_time = (time.time() - start_time) * 1000
        logger.info(
            f"RID: {request_id} | {request.method} {request.url.path} | "
            f"{response.status_code} | {process_time:.2f}ms"
        )

        response.headers["X-Request-ID"] = request_id
        return response

    # Global Exception Handlers
    @app.exception_handler(SynthBaseException)
    async def synth_exception_handler(request: Request, exc: SynthBaseException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.message,
                "error_code": exc.__class__.__name__
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", "unknown")
        logger.error(f"RID: {request_id} | UNHANDLED EXCEPTION: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
                "request_id": request_id
            },
        )

    app.include_router(routes.router, prefix=settings.API_V1_STR)

    static_dir = Path(__file__).resolve().parent.parent / "static"
    if static_dir.is_dir():
        app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    return app

app = create_app()


@app.get("/", response_class=HTMLResponse)
async def root():
    """Synth-1 home (API backend has no separate web app in this repo)."""
    name = settings.PROJECT_NAME
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{name}</title>
  <style>
    :root {{ color-scheme: light dark; }}
    body {{ font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.5; }}
    h1 {{ font-size: 1.5rem; font-weight: 600; margin: 0 0 0.5rem; }}
    p.muted {{ color: #666; margin: 0 0 1.5rem; font-size: 0.95rem; }}
    ul {{ list-style: none; padding: 0; margin: 0; }}
    li {{ margin: 0.6rem 0; }}
    a {{ color: inherit; }}
    .pill {{ display: inline-block; font-size: 0.8rem; padding: 0.2rem 0.55rem; border-radius: 999px; background: #eee; }}
    @media (prefers-color-scheme: dark) {{ .pill {{ background: #333; }} }}
  </style>
</head>
<body>
  <h1>{name}</h1>
  <p class="muted">B2B Fashion Platform — backend API. Use the links below while the server runs.</p>
  <ul>
    <li><a href="/health"><span class="pill">GET</span> /health — service status</a></li>
    <li><a href="/api/v1/health"><span class="pill">GET</span> /api/v1/health — API v1 ping</a></li>
    <li><a href="/docs"><span class="pill">API</span> OpenAPI (Swagger) — reference only</a></li>
    <li><a href="/static/linesheets/LS-1-Summer_Collection_2026.pdf"><span class="pill">PDF</span> Sample linesheet</a></li>
  </ul>
</body>
</html>"""
    return HTMLResponse(content=html)


@app.get("/health", tags=["health"])
async def health_check():
    checks = {"project": settings.PROJECT_NAME}

    async def _db_ping() -> str:
        try:
            from app.db.session import engine
            from sqlalchemy import text

            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return "ok"
        except Exception:
            return "error"

    def _clip_ping() -> str:
        try:
            from app.ai.embeddings.clip_backend import is_clip_available

            return "ready" if is_clip_available() else "fallback"
        except Exception:
            return "unavailable"

    db_result, clip_result = await asyncio.gather(
        _db_ping(),
        asyncio.to_thread(_clip_ping),
    )
    checks["db"] = db_result
    checks["ai_clip"] = clip_result
    checks["status"] = "ok" if db_result == "ok" else "degraded"
    return checks


@app.get("/api/v1/health", tags=["health"])
async def api_v1_health_check():
    return {"status": "ok", "v1": True}
