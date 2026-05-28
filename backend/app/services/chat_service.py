from __future__ import annotations

from ai_engine.groq_client import GroqClient
from app.core.config import get_settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.data_store import data_store
from chat_assistant.assistant import recruiter_chat


settings = get_settings()
client = GroqClient(settings.groq_api_key, settings.groq_model)


async def handle_chat(payload: ChatRequest) -> ChatResponse:
    candidates = [cand.model_dump() for cand in data_store.get_candidates()]
    response = await recruiter_chat(client, payload.query, candidates, payload.job_title)
    return ChatResponse(**response)
