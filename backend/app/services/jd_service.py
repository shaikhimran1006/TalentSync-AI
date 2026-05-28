from __future__ import annotations

from ai_engine.groq_client import GroqClient
from ai_engine.job_understanding import IdealCandidateDNA, analyze_job_description
from app.core.config import get_settings


settings = get_settings()
client = GroqClient(settings.groq_api_key, settings.groq_model)


async def analyze_job(description: str) -> IdealCandidateDNA:
    return await analyze_job_description(client, description)
