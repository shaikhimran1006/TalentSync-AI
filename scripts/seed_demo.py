from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND_ROOT = ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.append(str(BACKEND_ROOT))

from app.db.models import Base, CandidateModel, JobModel
from app.db.session import SessionLocal, engine

SAMPLE_DIR = ROOT / "sample_data"


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    candidates_path = SAMPLE_DIR / "candidates" / "candidates.json"
    jobs_path = SAMPLE_DIR / "jobs"

    candidates = json.loads(candidates_path.read_text(encoding="utf-8"))

    async with SessionLocal() as session:
        for candidate in candidates:
            session.add(
                CandidateModel(
                    id=candidate["id"],
                    name=candidate["name"],
                    role=candidate["role"],
                    location=candidate["location"],
                    experience_years=candidate["experience_years"],
                    summary=candidate["summary"],
                    leadership=candidate.get("leadership", 0.6),
                    learning_velocity=candidate.get("learning_velocity", 0.6),
                    stability=candidate.get("stability", 0.6),
                    collaboration=candidate.get("collaboration", 0.6),
                )
            )

        for job_file in jobs_path.glob("*.txt"):
            session.add(
                JobModel(
                    id=f"job_{job_file.stem}",
                    title=job_file.stem.replace("_", " ").title(),
                    description=job_file.read_text(encoding="utf-8"),
                )
            )

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
