from __future__ import annotations

from typing import Dict, List

from ai_engine.groq_client import GroqClient


async def recruiter_chat(
    client: GroqClient,
    query: str,
    candidates: List[Dict[str, object]],
    job_title: str,
) -> Dict[str, object]:
    def _fallback() -> Dict[str, object]:
        top = candidates[:5]
        return {
            "answer": "Here are top candidates based on current scores and skill alignment.",
            "selected_ids": [c["id"] for c in top],
            "rationale": "Used cached scores and skill alignment for fast shortlist.",
        }

    if not client.is_configured():
        return _fallback()

    prompt = (
        "You are a recruiter copilot. Answer the query and select candidates by id. "
        "Return JSON with keys: answer, selected_ids, rationale.\n"
        f"Job title: {job_title}\n"
        f"Query: {query}\n"
        f"Candidates: {candidates}\n"
    )

    try:
        response = await client.chat(
            messages=[
                {"role": "system", "content": "You are a recruiter copilot."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=400,
        )

        import json

        return json.loads(response)
    except Exception:
        return _fallback()
