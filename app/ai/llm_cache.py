from typing import Optional
import hashlib
from app.core.logging import logger

class LLMCache:
    def __init__(self, expiration_seconds: int = 3600):
        # Placeholder for real Redis cache
        self.cache = {}
        self.expiration_seconds = expiration_seconds

    async def get(self, prompt: str, system_prompt: Optional[str] = None) -> Optional[str]:
        # Simple key generation based on prompt/system_prompt hash
        key = self._generate_key(prompt, system_prompt)
        cached_result = self.cache.get(key)
        
        if cached_result:
            return cached_result
        
        return None

    async def set(self, prompt: str, system_prompt: Optional[str], response: str):
        # Key generation
        key = self._generate_key(prompt, system_prompt)
        
        # In a real implementation, you would use Redis and an expiration policy
        self.cache[key] = response
        logger.debug(f"LLM response cached with key: {key}")

    def _generate_key(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        # Concatenate and hash for a simple, deterministic key
        data = (system_prompt or "") + prompt
        return hashlib.sha256(data.encode()).hexdigest()

llm_cache = LLMCache()
