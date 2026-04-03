from app.core.config import settings

class AIConfig:
    MODEL = settings.AI_MODEL
    MAX_TOKENS = settings.AI_MAX_TOKENS
    TEMPERATURE = settings.AI_TEMPERATURE
    TIMEOUT = settings.AI_TIMEOUT
    RETRY_COUNT = settings.AI_RETRY_COUNT
    ENABLE_CACHE = settings.AI_ENABLE_CACHE

ai_config = AIConfig()
