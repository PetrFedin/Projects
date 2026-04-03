"""РФ интеграции: CRPT, ЭДО, 1С, СДЭК, Оплата."""

from .crpt import CRPTClient
from .edo import EDOClient
from .c1c import C1CClient
from .cdek import CDEKClient
from .payment import PaymentClient

__all__ = [
    "CRPTClient",
    "EDOClient",
    "C1CClient",
    "CDEKClient",
    "PaymentClient",
]
