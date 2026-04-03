# Production domain services — use ProductionService (facade) for backward compatibility.
from app.services.production.facade import ProductionService

__all__ = ["ProductionService"]
