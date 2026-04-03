from typing import Optional
from app.core.logging import logger
from app.core.exceptions import AIException

class TokenGuard:
    def __init__(self, max_prompt_length: int = 100000, max_cost: float = 1.0):
        self.max_prompt_length = max_prompt_length
        self.max_cost = max_cost

    def check_prompt(self, prompt: str):
        # 1. Check length
        if len(prompt) > self.max_prompt_length:
            logger.error(f"Prompt exceeds length limit: {len(prompt)}")
            raise AIException(f"Prompt too long: {len(prompt)}")
            
        # 2. Estimate cost (simplified)
        estimated_cost = self._estimate_cost(prompt)
        if estimated_cost > self.max_cost:
            logger.error(f"Prompt estimated cost exceeds limit: {estimated_cost}")
            raise AIException(f"Prompt too expensive: {estimated_cost}")

    def _estimate_cost(self, prompt: str) -> float:
        # Simplified cost estimation based on character count
        # In real-world usage, this should use tokenizers
        return (len(prompt) / 4000) * 0.01

token_guard = TokenGuard()
