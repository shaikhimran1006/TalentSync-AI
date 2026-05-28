from __future__ import annotations

from pydantic import BaseModel

from ai_engine.job_understanding import IdealCandidateDNA


class JobAnalyzeRequest(BaseModel):
    title: str
    description: str


class JobAnalyzeResponse(BaseModel):
    job_id: str
    dna: IdealCandidateDNA
