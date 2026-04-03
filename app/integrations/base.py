"""Base integration client."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseIntegrationClient(ABC):
    """Base class for integration clients."""

    @property
    @abstractmethod
    def is_configured(self) -> bool:
        """True if credentials are set and integration can be used."""
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Check if integration is reachable and credentials are valid."""
        pass
