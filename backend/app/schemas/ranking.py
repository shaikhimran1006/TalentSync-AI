from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel

from app.schemas.candidate import Candidate


class RankingRequest(BaseModel):
    job_title: str
    job_description: str
    weights: Optional[Dict[str, float]] = None
    candidate_ids: Optional[List[str]] = None


class RankingPdfRequest(RankingRequest):
    top_n: Optional[int] = None


class RankedCandidate(BaseModel):
    candidate: Candidate
    scores: Dict[str, float]
    final_score: float
    strengths: List[str]
    gaps: List[str]
    transfers: List[str]
    explanation: str
    risk_flags: List[str]


class RankingResponse(BaseModel):
    ranked_candidates: List[RankedCandidate]
