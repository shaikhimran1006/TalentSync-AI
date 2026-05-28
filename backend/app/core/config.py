from __future__ import annotations

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    groq_model: str = "llama3-70b-8192"
    database_url: str = "sqlite+aiosqlite:///./talentsync.db"
    redis_url: str | None = None
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    rerank_model: str = "cross-encoder/ms-marco-MiniLM-L-6-v2"

    class Config:
        env_file = ".env"


_settings = Settings()


def get_settings() -> Settings:
    return _settings
