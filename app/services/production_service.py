# Backward compatibility: ProductionService is now a facade over domain services.
from app.services.production import ProductionService

__all__ = ["ProductionService"]
