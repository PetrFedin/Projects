# PLM API: single router (routes live in routes.py; can be split into tech_pack, production, sourcing, compliance, finance later).
from app.api.v1.endpoints.plm.routes import router

__all__ = ["router"]
