from typing import List, Optional, Any
from pydantic import BaseModel
from app.ai.llm_client import llm_client
from app.core.logging import logger

class AgentResult(BaseModel):
    agent_name: str
    task_type: str
    files_used: List[str]
    changes_proposed: List[str]
    code_changes: Optional[str] = None
    tests_added: Optional[str] = None
    risks: Optional[List[str]] = None
    token_optimization_notes: Optional[str] = None
    master_plan_updates: Optional[str] = None
    next_step: Optional[str] = None

class BaseAgent:
    def __init__(
        self, 
        name: str, 
        task_type: str, 
        system_prompt: str,
        max_tokens: int = 500,
        temperature: float = 0.0
    ):
        self.agent_name = name
        self.task_type = task_type
        self.system_prompt = system_prompt
        self.max_tokens = max_tokens
        self.temperature = temperature

    async def run(self, task_description: str, context: Optional[dict] = None) -> AgentResult:
        logger.info(f"{self.agent_name} processing: {task_description}")
        
        prompt = self._build_prompt(task_description, context)
        response = await llm_client.complete(
            prompt, 
            system_prompt=self.system_prompt,
            max_tokens=self.max_tokens,
            temperature=self.temperature
        )
        
        return self._format_result(task_description, response)

    def _build_prompt(self, task: str, context: Optional[dict]) -> str:
        return task

    def _format_result(self, task: str, response: str) -> AgentResult:
        return AgentResult(
            agent_name=self.agent_name,
            task_type=self.task_type,
            files_used=[],
            changes_proposed=[f"LLM Response: {response[:50]}..."],
            next_step="Validate changes"
        )
