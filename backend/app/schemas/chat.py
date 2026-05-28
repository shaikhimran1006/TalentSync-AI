from __future__ import annotations

from typing import List

from pydantic import BaseModel


class ChatRequest(BaseModel):
    query: str
    job_title: str
    job_description: str


class ChatResponse(BaseModel):
    answer: str
    selected_ids: List[str]
    rationale: str
