from app.core.config import settings

class AIConfig:
    PROVIDER = settings.LLM_PROVIDER
    MODEL = settings.AI_MODEL
    OLLAMA_BASE_URL = settings.OLLAMA_BASE_URL
    OLLAMA_MODEL = settings.OLLAMA_MODEL
    OPENAI_MODEL = settings.OPENAI_MODEL
    MAX_TOKENS = settings.AI_MAX_TOKENS
    TEMPERATURE = settings.AI_TEMPERATURE
    TIMEOUT = settings.AI_TIMEOUT
    RETRY_COUNT = settings.AI_RETRY_COUNT
    ENABLE_CACHE = settings.AI_ENABLE_CACHE

ai_config = AIConfig()
