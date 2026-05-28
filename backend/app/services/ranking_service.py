from __future__ import annotations

import asyncio
import hashlib
from typing import Dict, List, Tuple

import numpy as np

from ai_engine.behavioral import compute_behavioral_signals
from ai_engine.embeddings import EmbeddingModel
from ai_engine.explainability import generate_explanation
from ai_engine.groq_client import GroqClient
from ai_engine.reranker import CrossEncoderReranker
from ai_engine.skill_transfer import infer_transferable_skills
from app.core.config import get_settings
from app.schemas.ranking import RankedCandidate, RankingRequest
from app.services.data_store import data_store
from ranking_engine.scoring import compute_final_score
from ranking_engine.weights import DEFAULT_WEIGHTS
from resume_parser.skills import SKILL_KEYWORDS
from vector_store.cache import EmbeddingCache
from vector_store.faiss_store import FaissVectorStore


settings = get_settings()
_embedder = EmbeddingModel(settings.embedding_model)
_reranker = CrossEncoderReranker(settings.rerank_model)
_groq = GroqClient(settings.groq_api_key, settings.groq_model)
_cache = EmbeddingCache(settings.redis_url)


def _candidate_text(candidate) -> str:
    return " ".join([
        candidate.summary,
        " ".join(candidate.skills),
        " ".join(candidate.domains),
        " ".join(candidate.projects),
    ])


def _extract_job_skills(text: str) -> List[str]:
    lowered = text.lower()
    return [skill for skill in SKILL_KEYWORDS if skill.lower() in lowered]


def _skill_overlap(job_skills: List[str], candidate_skills: List[str]) -> float:
    if not job_skills:
        return 0.5
    overlap = set(skill.lower() for skill in job_skills) & set(skill.lower() for skill in candidate_skills)
    return round(len(overlap) / max(len(job_skills), 1), 3)


def _domain_match(job_text: str, candidate_domains: List[str]) -> float:
    lowered = job_text.lower()
    hits = sum(1 for domain in candidate_domains if domain.lower() in lowered)
    return round(min(hits / max(len(candidate_domains), 1), 1.0), 3)


async def _embed_texts(texts: List[str]) -> np.ndarray:
    if not texts:
        return np.zeros((0, 0), dtype="float32")

    embeddings: List[List[float] | None] = [None] * len(texts)
    missing: List[Tuple[int, str, str]] = []

    for idx, text in enumerate(texts):
        key = f"embed:{hashlib.md5(text.encode('utf-8')).hexdigest()}"
        cached = await _cache.get(key)
        if cached is not None:
            embeddings[idx] = cached
        else:
            missing.append((idx, text, key))

    if missing:
        new_vectors = _embedder.embed([item[1] for item in missing])
        for (idx, _, key), vector in zip(missing, new_vectors):
            vector_list = vector.tolist()
            embeddings[idx] = vector_list
            await _cache.set(key, vector_list)

    if any(vector is None for vector in embeddings):
        raise ValueError("Embedding cache returned incomplete results")
    return np.asarray([vector for vector in embeddings], dtype="float32")


async def _semantic_scores(job_desc: str, candidates) -> Dict[str, float]:
    if not candidates:
        return {}
    candidate_texts = [_candidate_text(cand) for cand in candidates]
    candidate_vectors = await _embed_texts(candidate_texts)
    query_vector = (await _embed_texts([job_desc]))[0]

    scores: Dict[str, float] = {}
    try:
        store = FaissVectorStore(dimension=candidate_vectors.shape[1])
        store.add(candidate_vectors, [cand.id for cand in candidates])
        for cand_id, score in store.search(query_vector, top_k=len(candidates)):
            scores[cand_id] = score
    except Exception:
        dots = np.dot(candidate_vectors, query_vector.T).reshape(-1)
        for cand, score in zip(candidates, dots):
            scores[cand.id] = float(score)

    try:
        rerank_scores = _reranker.score(job_desc, candidate_texts)
        for cand, rerank_score in zip(candidates, rerank_scores):
            scores[cand.id] = round((scores.get(cand.id, 0.0) + float(rerank_score)) / 2, 4)
    except Exception:
        pass

    return scores


def _risk_flags(candidate, technical_fit: float) -> List[str]:
    flags: List[str] = []
    if candidate.stability < 0.6:
        flags.append("stability risk")
    if technical_fit < 0.4:
        flags.append("low direct technical match")
    return flags


def _strengths(candidate, technical_fit: float) -> List[str]:
    strengths = []
    if technical_fit >= 0.6:
        strengths.append("strong technical overlap")
    if candidate.leadership >= 0.75:
        strengths.append("leadership signals")
    if candidate.learning_velocity >= 0.8:
        strengths.append("high learning velocity")
    return strengths


async def rank_candidates(payload: RankingRequest) -> List[RankedCandidate]:
    candidates = data_store.get_candidates()
    if payload.candidate_ids:
        candidates = [cand for cand in candidates if cand.id in payload.candidate_ids]

    if not candidates:
        return []

    job_skills = _extract_job_skills(payload.job_description)
    semantic_scores = await _semantic_scores(payload.job_description, candidates)
    weights = payload.weights or DEFAULT_WEIGHTS

    ranked: List[RankedCandidate] = []
    tasks = []

    for candidate in candidates:
        technical_fit = _skill_overlap(job_skills, candidate.skills)
        behavioral_raw = data_store.get_behavioral(candidate.id)
        behavioral = compute_behavioral_signals(behavioral_raw)
        domain_match = _domain_match(payload.job_description, candidate.domains)

        scores = {
            "semantic_match": semantic_scores.get(candidate.id, 0.0),
            "technical_fit": technical_fit,
            "behavioral_score": behavioral.growth_potential,
            "learning_velocity": candidate.learning_velocity,
            "domain_match": domain_match,
            "stability_score": candidate.stability,
        }

        final_score = compute_final_score(scores, weights)
        transfers_map = infer_transferable_skills(candidate.skills)
        transfers = [item for items in transfers_map.values() for item in items]
        strengths = _strengths(candidate, technical_fit)
        gaps = [] if technical_fit >= 0.5 else ["limited direct overlap"]
        risk_flags = _risk_flags(candidate, technical_fit)

        task = generate_explanation(
            _groq,
            candidate.name,
            payload.job_title,
            strengths,
            gaps,
            transfers,
        )
        tasks.append(task)

        ranked.append(
            RankedCandidate(
                candidate=candidate,
                scores=scores,
                final_score=final_score,
                strengths=strengths,
                gaps=gaps,
                transfers=transfers,
                explanation="",
                risk_flags=risk_flags,
            )
        )

    explanations = await asyncio.gather(*tasks)
    for item, explanation in zip(ranked, explanations):
        item.explanation = explanation

    ranked.sort(key=lambda item: item.final_score, reverse=True)
    return ranked


def find_similar_candidates(candidate_id: str, top_k: int = 3):
    candidates = data_store.get_candidates()
    target = next((cand for cand in candidates if cand.id == candidate_id), None)
    if target is None:
        return []

    candidate_texts = [_candidate_text(cand) for cand in candidates]
    candidate_vectors = _embedder.embed(candidate_texts)
    target_vector = _embedder.embed([_candidate_text(target)])[0]
    scores = np.dot(candidate_vectors, target_vector.T).reshape(-1)

    scored = [
        (cand, float(score))
        for cand, score in zip(candidates, scores)
        if cand.id != candidate_id
    ]
    scored.sort(key=lambda item: item[1], reverse=True)
    return [cand for cand, _ in scored[:top_k]]
