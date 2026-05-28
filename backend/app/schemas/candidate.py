from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class GrowthPoint(BaseModel):
    year: int
    level: str


class Candidate(BaseModel):
    id: str
    name: str
    role: str
    location: str
    experience_years: int
    summary: str
    skills: List[str]
    domains: List[str]
    leadership: float
    learning_velocity: float
    stability: float
    collaboration: float
    projects: List[str]
    growth_timeline: List[GrowthPoint] = Field(default_factory=list)
    behavioral_score: Optional[float] = None


class CandidateSummary(BaseModel):
    candidates: List[Candidate]


class CandidateResponse(BaseModel):
    candidate: Candidate
