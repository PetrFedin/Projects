from typing import List, Optional, Any
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    
    PROJECT_NAME: str = "Synth-1 Fashion OS"
    API_V1_STR: str = "/api/v1"
    
    # AI Config
    AI_MODEL: str = "gemini-1.5-flash"
    GEMINI_API_KEY: Optional[str] = None
    AI_MAX_TOKENS: int = 2000
    AI_TEMPERATURE: float = 0.0
    AI_TIMEOUT: float = 30.0
    AI_RETRY_COUNT: int = 3
    AI_ENABLE_CACHE: bool = True
    
    # Database Integration (P1)
    # - [completed] Setup async engine & session management
    # - [completed] Define Task & AgentState models
    # - [completed] Implement BaseRepository pattern
    
    # Database Config
    DATABASE_URL: str = "sqlite+aiosqlite:///./synth1.db"
    REDIS_URL: Optional[str] = None

    # Security
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"
    AUTH_RATE_LIMIT: int = 10
    AUTH_RATE_WINDOW: int = 60
    SECRET_KEY: str = "SUPER_SECRET_KEY_FOR_DEVELOPMENT_ONLY"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # --- РФ Интеграции ---
    # Честный ЗНАК (CRPT)
    CRPT_API_URL: str = "https://markirovka.crpt.ru/api/v3"
    CRPT_CLIENT_ID: Optional[str] = None
    CRPT_CLIENT_SECRET: Optional[str] = None

    # ЭДО (Диадок / Контур)
    EDO_PROVIDER: str = "diadoc"
    DIADOC_API_URL: str = "https://diadoc-api.kontur.ru"
    DIADOC_API_KEY: Optional[str] = None
    KONTUR_EDO_API_URL: Optional[str] = None
    KONTUR_EDO_TOKEN: Optional[str] = None

    # 1С
    C1C_BASE_URL: Optional[str] = None
    C1C_USER: Optional[str] = None
    C1C_PASSWORD: Optional[str] = None

    # СДЭК
    CDEK_API_URL: str = "https://api.cdek.ru/v2"
    CDEK_CLIENT_ID: Optional[str] = None
    CDEK_CLIENT_SECRET: Optional[str] = None

    # Оплата (СБП / Эквайринг)
    PAYMENT_PROVIDER: str = "tinkoff"
    TINKOFF_TERMINAL_KEY: Optional[str] = None
    TINKOFF_SECRET_KEY: Optional[str] = None
    SBP_MERCHANT_ID: Optional[str] = None

    # Endpoint usage audit (CLEANUP_PLAN Phase 5)
    ENABLE_ENDPOINT_STATS: bool = False
    # MVP mode: keep external APIs disabled by default
    ENABLE_EXTERNAL_APIS: bool = False

    # AI rate limit (requests per window per user)
    AI_TASK_RATE_LIMIT: int = 20
    AI_TASK_RATE_WINDOW: int = 60

    # Marketplace (Shopify, Ozon, WB) — MVP: stub when not configured
    SHOPIFY_SHOP_URL: Optional[str] = None
    SHOPIFY_ACCESS_TOKEN: Optional[str] = None
    OZON_CLIENT_ID: Optional[str] = None
    OZON_API_KEY: Optional[str] = None
    WB_API_KEY: Optional[str] = None

    @model_validator(mode="after")
    def validate_secret_key_prod(self) -> "Settings":
        if self.ENVIRONMENT in ("production", "prod") and self.SECRET_KEY == "SUPER_SECRET_KEY_FOR_DEVELOPMENT_ONLY":
            raise ValueError("SECRET_KEY must be set to a secure value in production (ENVIRONMENT=production)")
        return self


settings = Settings()
