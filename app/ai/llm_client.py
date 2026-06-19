from typing import Optional

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
        temperature: Optional[float] = None,
    ) -> str:
        token_guard.check_prompt(prompt)

        if self.config.ENABLE_CACHE:
            cached_response = await llm_cache.get(prompt, system_prompt)
            if cached_response:
                logger.info("LLM cache hit")
                return cached_response

        actual_max_tokens = max_tokens or self.config.MAX_TOKENS
        actual_temp = temperature if temperature is not None else self.config.TEMPERATURE
        model_label = self._active_model_label()
        logger.info(
            f"LLM call [Provider: {self.config.PROVIDER}, Model: {model_label}, "
            f"MaxTokens: {actual_max_tokens}, Temp: {actual_temp}]"
        )

        response_text = None
        for attempt in range(1, (self.config.RETRY_COUNT or 3) + 1):
            try:
                response_text = await self._dispatch(
                    prompt, system_prompt, actual_max_tokens, actual_temp
                )
                break
            except Exception as e:
                if attempt < (self.config.RETRY_COUNT or 3):
                    logger.warning(f"LLM call attempt {attempt} failed, retrying: {e}")
                else:
                    logger.error(f"LLM call failed after {attempt} attempts: {e}")
                    raise AIException(f"LLM processing error: {str(e)}") from e

        token_usage_logger.log(prompt=prompt, response=response_text, model=model_label)
        if self.config.ENABLE_CACHE:
            await llm_cache.set(prompt, system_prompt, response_text)
        return response_text

    def _active_model_label(self) -> str:
        from app.core.config import settings

        if settings.LLM_PROVIDER == "ollama":
            return settings.OLLAMA_MODEL or settings.AI_MODEL
        if settings.LLM_PROVIDER == "openai":
            return settings.OPENAI_MODEL
        return settings.AI_MODEL

    async def _dispatch(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
    ) -> str:
        from app.core.config import settings

        provider = (settings.LLM_PROVIDER or "ollama").lower()
        if provider == "ollama":
            return await self._ollama_call(prompt, system_prompt, max_tokens, temperature)
        if provider == "openai" and settings.OPENAI_API_KEY:
            return await self._openai_call(prompt, system_prompt, max_tokens, temperature)
        if provider == "gemini" and settings.GEMINI_API_KEY:
            return await self._gemini_call(prompt, system_prompt, max_tokens, temperature)
        # Fallback chain: ollama → openai → gemini → bootstrap
        try:
            return await self._ollama_call(prompt, system_prompt, max_tokens, temperature)
        except Exception as ollama_err:
            logger.warning("Ollama unavailable: %s", ollama_err)
        if settings.OPENAI_API_KEY:
            return await self._openai_call(prompt, system_prompt, max_tokens, temperature)
        if settings.GEMINI_API_KEY:
            return await self._gemini_call(prompt, system_prompt, max_tokens, temperature)
        return f"Bootstrap response for model {self._active_model_label()}"

    async def _ollama_call(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
    ) -> str:
        from app.core.config import settings

        base = settings.OLLAMA_BASE_URL.rstrip("/")
        model = settings.OLLAMA_MODEL or settings.AI_MODEL
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        body = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"num_predict": max_tokens, "temperature": temperature},
        }
        async with httpx.AsyncClient(timeout=self.config.TIMEOUT or 60) as client:
            r = await client.post(f"{base}/api/chat", json=body)
            r.raise_for_status()
        data = r.json()
        msg = data.get("message") or {}
        text = msg.get("content") or data.get("response") or ""
        if not text:
            raise AIException("Ollama returned empty response")
        return text

    async def _openai_call(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
    ) -> str:
        from app.core.config import settings

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        body = {
            "model": settings.OPENAI_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
        async with httpx.AsyncClient(timeout=self.config.TIMEOUT or 60) as client:
            r = await client.post(
                "https://api.openai.com/v1/chat/completions",
                json=body,
                headers=headers,
            )
            r.raise_for_status()
        data = r.json()
        choices = data.get("choices") or []
        if not choices:
            raise AIException("OpenAI returned no choices")
        return choices[0]["message"]["content"] or ""

    async def _gemini_call(
        self,
        prompt: str,
        system_prompt: Optional[str],
        max_tokens: int,
        temperature: float,
    ) -> str:
        from app.core.config import settings

        key = settings.GEMINI_API_KEY or ""
        model = settings.AI_MODEL
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


llm_client = LLMClient()
