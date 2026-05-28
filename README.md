# TalentSync AI

TalentSync AI is an AI hiring intelligence platform that simulates elite recruiter reasoning. It goes beyond keyword matching by understanding job intent, evaluating semantic fit, inferring transferable skills, and producing explainable rankings with recruiter-style insights.

## Core capabilities

- Deep job understanding that generates an Ideal Candidate DNA
- Resume parsing for PDF and DOCX using PyMuPDF, spaCy, and regex pipelines
- Semantic intelligence using embeddings, FAISS similarity search, and cross-encoder reranking
- Weighted ranking engine with configurable scoring
- Behavioral intelligence layer and Growth Potential Score
- Explainable AI insights for every candidate
- Recruiter Copilot chat with conversational querying and dynamic reranking
- Premium, futuristic UI with dashboards, analytics, and candidate profiles

## Architecture

frontend/
backend/
ai_engine/
vector_store/
ranking_engine/
resume_parser/
chat_assistant/
sample_data/

## Tech stack

Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui-style components, Framer Motion, Recharts, TanStack Table
Backend: FastAPI, Python 3.11+, async APIs, Pydantic
AI/ML: Groq Llama 3, sentence-transformers, BGE-small/E5-small embeddings, cross-encoder reranker, FAISS, spaCy
Data: PostgreSQL, Redis (optional), FAISS vector index

## Quick start

1) Backend setup

- Create a virtual environment and install dependencies.
- Install spaCy model: python -m spacy download en_core_web_sm
- Set env vars in .env (see .env.example)
- Run: uvicorn app.main:app --reload

2) Frontend setup

- Install dependencies: npm install
- Set NEXT_PUBLIC_API_URL in frontend/.env.local
- Run: npm run dev

3) Demo data

- Sample job descriptions and resumes are in sample_data/
- Use the /seed endpoint or scripts/seed_demo.py to load mock data

## Environment variables

Backend:
- GROQ_API_KEY
- GROQ_MODEL (default: llama3-70b-8192)
- DATABASE_URL
- REDIS_URL (optional)
- EMBEDDING_MODEL
- RERANK_MODEL

Frontend:
- NEXT_PUBLIC_API_URL

## Demo workflow

1) Upload or paste a job description
2) Parse sample resumes or ingest mock candidates
3) Run ranking and review explainable insights
4) Use Recruiter Copilot to query the candidate pool

## API summary

- POST /jobs/analyze
- POST /candidates/parse
- GET /candidates
- GET /candidates/{id}
- GET /candidates/{id}/similar
- POST /rank
- POST /chat
- POST /seed

## Notes

- This is a demo-ready POC with realistic AI behavior and seeded data.
- For production, switch DATABASE_URL to PostgreSQL and enable Redis caching.
- FAISS installation can vary by platform. If needed, replace with a compatible build.
