from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.candidate import CandidateResponse, CandidateSummary
from app.schemas.job import JobAnalyzeRequest, JobAnalyzeResponse
from app.schemas.ranking import RankingRequest, RankingResponse
from app.services.chat_service import handle_chat
from app.services.data_store import data_store
from app.services.jd_service import analyze_job
from app.services.ranking_service import find_similar_candidates, rank_candidates
from resume_parser.parser import parse_resume_file


api_router = APIRouter()


@api_router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@api_router.post("/jobs/analyze", response_model=JobAnalyzeResponse)
async def analyze_job_endpoint(payload: JobAnalyzeRequest) -> JobAnalyzeResponse:
    analysis = await analyze_job(payload.description)
    job_id = data_store.add_job(payload.title, payload.description, analysis)
    return JobAnalyzeResponse(job_id=job_id, dna=analysis)


@api_router.post("/candidates/parse", response_model=CandidateResponse)
async def parse_candidate_resume(file: UploadFile = File(...)) -> CandidateResponse:
    suffix = file.filename.split(".")[-1].lower()
    if suffix not in {"pdf", "docx", "txt"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    temp_path = await data_store.save_upload(file)
    parsed = parse_resume_file(temp_path)
    candidate = data_store.ingest_parsed_candidate(file.filename, parsed)
    return CandidateResponse(candidate=candidate)


@api_router.get("/candidates", response_model=CandidateSummary)
async def list_candidates() -> CandidateSummary:
    return CandidateSummary(candidates=data_store.get_candidates())


@api_router.get("/candidates/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(candidate_id: str) -> CandidateResponse:
    candidate = data_store.get_candidate(candidate_id)
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return CandidateResponse(candidate=candidate)


@api_router.get("/candidates/{candidate_id}/similar", response_model=CandidateSummary)
async def get_similar_candidates(candidate_id: str) -> CandidateSummary:
    similar = find_similar_candidates(candidate_id)
    return CandidateSummary(candidates=similar)


@api_router.post("/rank", response_model=RankingResponse)
async def rank_candidates_endpoint(payload: RankingRequest) -> RankingResponse:
    ranked = await rank_candidates(payload)
    return RankingResponse(ranked_candidates=ranked)


@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
    response = await handle_chat(payload)
    return response


@api_router.post("/seed")
async def seed_demo() -> dict:
    await data_store.load_sample_data(force=True)
    return {"status": "seeded"}
