from typing import Any, Dict, Optional
import httpx
from app.ai.ai_config import ai_config
from app.core.logging import logger
from app.core.exceptions import AIException
from app.ai.token_guard import token_guard
from app.ai.llm_cache import llm_cache
from app.ai.token_usage_logger import token_usage_logger

class LLMClient:
    def __init__(self):
        self.config = ai_config

    async def complete(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None
    ) -> str:
        # 1. Token Guard check
        token_guard.check_prompt(prompt)
        
        # 2. Cache check
        if self.config.ENABLE_CACHE:
            cached_response = await llm_cache.get(prompt, system_prompt)
            if cached_response:
                logger.info("LLM cache hit")
                return cached_response
        
        # Use provided values or defaults from config
        actual_max_tokens = max_tokens or self.config.MAX_TOKENS
        actual_temp = temperature if temperature is not None else self.config.TEMPERATURE
        
        # 3. Actual LLM call (placeholder for real integration)
        logger.info(f"LLM call [Model: {self.config.MODEL}, MaxTokens: {actual_max_tokens}, Temp: {actual_temp}]")
        
        last_error = None
        for attempt in range(1, (self.config.RETRY_COUNT or 3) + 1):
            try:
                response_text = await self._mock_llm_call(prompt, system_prompt, actual_max_tokens, actual_temp)
                break
            except Exception as e:
                last_error = e
                if attempt < (self.config.RETRY_COUNT or 3):
                    logger.warning(f"LLM call attempt {attempt} failed, retrying: {e}")
                else:
                    logger.error(f"LLM call failed after {attempt} attempts: {e}")
                    raise AIException(f"LLM processing error: {str(e)}") from e

        # 4. Log usage
        token_usage_logger.log(prompt=prompt, response=response_text, model=self.config.MODEL)
        if self.config.ENABLE_CACHE:
            await llm_cache.set(prompt, system_prompt, response_text)
        return response_text

    async def _real_gemini_call(
        self, prompt: str, system_prompt: Optional[str], max_tokens: int, temperature: float
    ) -> str:
        """Call Gemini REST API. Requires GEMINI_API_KEY."""
        from app.core.config import settings
        key = getattr(settings, "GEMINI_API_KEY", None) or ""
        if not key:
            return f"Bootstrap response for model {self.config.MODEL}"
        model = getattr(settings, "AI_MODEL", self.config.MODEL)
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        parts = [{"text": (system_prompt or "") + "\n\n" + prompt}]
        body = {
            "contents": [{"parts": parts}],
            "generationConfig": {"maxOutputTokens": max_tokens, "temperature": temperature},
        }
        async with httpx.AsyncClient(timeout=self.config.TIMEOUT or 60) as client:
            r = await client.post(url, json=body)
            r.raise_for_status()
        data = r.json()
        cands = data.get("candidates", [])
        if not cands:
            return ""
        parts_out = cands[0].get("content", {}).get("parts", [])
        return parts_out[0].get("text", "") if parts_out else ""

    async def _mock_llm_call(
        self, 
        prompt: str, 
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float
    ) -> str:
        from app.core.config import settings
        if getattr(settings, "GEMINI_API_KEY", None):
            try:
                return await self._real_gemini_call(prompt, system_prompt, max_tokens, temperature)
            except Exception as e:
                logger.warning("Gemini API failed, falling back to bootstrap: %s", e)
        return f"Bootstrap response for model {self.config.MODEL}"

llm_client = LLMClient()
