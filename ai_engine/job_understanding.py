from __future__ import annotations

import re
from typing import List

from pydantic import BaseModel, Field

from ai_engine.groq_client import GroqClient


class IdealCandidateDNA(BaseModel):
    technical_skills: List[str] = Field(default_factory=list)
    hidden_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    seniority_level: str = ""
    domain_requirements: List[str] = Field(default_factory=list)
    leadership_requirements: List[str] = Field(default_factory=list)
    communication_expectations: List[str] = Field(default_factory=list)
    work_style: List[str] = Field(default_factory=list)
    culture_fit: List[str] = Field(default_factory=list)
    adaptability_needs: List[str] = Field(default_factory=list)
    learning_expectations: List[str] = Field(default_factory=list)
    preferred_behaviors: List[str] = Field(default_factory=list)


def _simple_extract(text: str) -> IdealCandidateDNA:
    skills = re.findall(r"\b[A-Za-z][A-Za-z0-9+./-]{1,20}\b", text)
    skills = list(dict.fromkeys(skills))
    return IdealCandidateDNA(
        technical_skills=skills[:12],
        hidden_skills=skills[12:18],
        soft_skills=["collaboration", "communication", "ownership"],
        seniority_level="Senior",
        domain_requirements=["AI", "Platform", "Infrastructure"],
        leadership_requirements=["mentorship", "technical direction"],
        communication_expectations=["cross-functional", "stakeholder updates"],
        work_style=["async", "high ownership"],
        culture_fit=["startup mindset", "execution focus"],
        adaptability_needs=["new tooling", "fast iteration"],
        learning_expectations=["continuous learning"],
        preferred_behaviors=["initiative", "collaboration"],
    )


async def analyze_job_description(client: GroqClient, text: str) -> IdealCandidateDNA:
    if not client.is_configured():
        return _simple_extract(text)

    prompt = (
        "Extract the Ideal Candidate DNA as JSON with keys: technical_skills, hidden_skills, "
        "soft_skills, seniority_level, domain_requirements, leadership_requirements, "
        "communication_expectations, work_style, culture_fit, adaptability_needs, "
        "learning_expectations, preferred_behaviors.\n"
        f"Job description:\n{text}"
    )

    try:
        response = await client.chat(
            messages=[
                {"role": "system", "content": "You extract structured recruiter insights."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            max_tokens=500,
        )
        return IdealCandidateDNA.model_validate_json(response)
    except Exception:
        return _simple_extract(text)
