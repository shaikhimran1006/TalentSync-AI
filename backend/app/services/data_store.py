from __future__ import annotations

import json
import uuid
from pathlib import Path
from typing import Dict, List, Optional

from app.schemas.candidate import Candidate, GrowthPoint
from ai_engine.job_understanding import IdealCandidateDNA


ROOT = Path(__file__).resolve().parents[3]
SAMPLE_DIR = ROOT / "sample_data"
UPLOAD_DIR = ROOT / "backend" / "tmp"


class DataStore:
    def __init__(self) -> None:
        self.candidates: List[Candidate] = []
        self.jobs: Dict[str, Dict[str, object]] = {}
        self.behavioral: Dict[str, Dict[str, float]] = {}

    async def load_sample_data(self, force: bool = False) -> None:
        if self.candidates and not force:
            return

        candidates_path = SAMPLE_DIR / "candidates" / "candidates.json"
        behavioral_path = SAMPLE_DIR / "candidates" / "behavioral.json"

        if candidates_path.exists():
            data = json.loads(candidates_path.read_text(encoding="utf-8"))
            self.candidates = [self._candidate_from_dict(item) for item in data]

        if behavioral_path.exists():
            behavioral_list = json.loads(behavioral_path.read_text(encoding="utf-8"))
            self.behavioral = {item["candidate_id"]: item for item in behavioral_list}

    def _candidate_from_dict(self, item: Dict[str, object]) -> Candidate:
        growth_timeline = [GrowthPoint(**point) for point in item.get("growth_timeline", [])]
        return Candidate(
            id=item["id"],
            name=item["name"],
            role=item["role"],
            location=item["location"],
            experience_years=item["experience_years"],
            summary=item["summary"],
            skills=item.get("skills", []),
            domains=item.get("domains", []),
            leadership=item.get("leadership", 0.6),
            learning_velocity=item.get("learning_velocity", 0.6),
            stability=item.get("stability", 0.6),
            collaboration=item.get("collaboration", 0.6),
            projects=item.get("projects", []),
            growth_timeline=growth_timeline,
        )

    def add_job(self, title: str, description: str, analysis: IdealCandidateDNA) -> str:
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        self.jobs[job_id] = {
            "title": title,
            "description": description,
            "analysis": analysis,
        }
        return job_id

    def get_candidates(self) -> List[Candidate]:
        return self.candidates

    def get_candidate(self, candidate_id: str) -> Optional[Candidate]:
        return next((cand for cand in self.candidates if cand.id == candidate_id), None)

    def get_behavioral(self, candidate_id: str) -> Dict[str, float]:
        return self.behavioral.get(candidate_id, {})

    async def save_upload(self, upload) -> Path:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        file_name = upload.filename or f"resume_{uuid.uuid4().hex}.txt"
        path = UPLOAD_DIR / f"{uuid.uuid4().hex}_{file_name}"
        content = await upload.read()
        path.write_bytes(content)
        return path

    def ingest_parsed_candidate(self, filename: str, parsed: Dict[str, object]) -> Candidate:
        candidate_id = f"cand_{uuid.uuid4().hex[:8]}"
        candidate = Candidate(
            id=candidate_id,
            name=filename.split(".")[0].replace("_", " ").title(),
            role="Parsed Candidate",
            location="Unknown",
            experience_years=3,
            summary="Parsed from resume",
            skills=list(parsed.get("skills", [])),
            domains=list(parsed.get("domains", [])),
            leadership=0.6,
            learning_velocity=0.65,
            stability=0.6,
            collaboration=0.7,
            projects=list(parsed.get("bullets", []))[:4],
            growth_timeline=[],
        )
        self.candidates.append(candidate)
        return candidate


data_store = DataStore()
