from __future__ import annotations

from typing import Dict, List

from ai_engine.groq_client import GroqClient


async def generate_explanation(
    client: GroqClient,
    candidate_name: str,
    job_title: str,
    strengths: List[str],
    gaps: List[str],
    transfers: List[str],
) -> str:
    strengths_text = ", ".join(strengths) or "strong core skills"
    gaps_text = ", ".join(gaps) or "no major gaps"
    transfers_text = ", ".join(transfers) or "adjacent skills"
    fallback = (
        f"{candidate_name} shows {strengths_text}. "
        f"Gaps include {gaps_text}. "
        f"Transferable strengths: {transfers_text}."
    )

    if not client.is_configured():
        return fallback

    prompt = (
        "You are an elite recruiter. Explain the candidate fit with strengths, risks, and transfers. "
        "Write in concise recruiter assistant tone.\n"
        f"Job: {job_title}\n"
        f"Candidate: {candidate_name}\n"
        f"Strengths: {', '.join(strengths)}\n"
        f"Gaps: {', '.join(gaps)}\n"
        f"Transferable skills: {', '.join(transfers)}\n"
    )

    try:
        content = await client.chat(
            messages=[
                {"role": "system", "content": "You generate concise recruiter explanations."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=220,
        )
        return content.strip()
    except Exception:
        return fallback
