from __future__ import annotations

from datetime import datetime
from typing import List

from fpdf import FPDF

from app.schemas.ranking import RankedCandidate


def _sanitize(text: str) -> str:
    return text.encode("latin-1", "replace").decode("latin-1")


def build_ranked_candidates_pdf(job_title: str, ranked: List[RankedCandidate]) -> bytes:
    pdf = FPDF(unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_title(_sanitize(f"Top Ranked Candidates - {job_title}"))

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, _sanitize("Top Ranked Candidates"), ln=True)

    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 6, _sanitize(f"Role: {job_title}"), ln=True)
    pdf.cell(0, 6, _sanitize(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"), ln=True)
    pdf.ln(2)

    for index, item in enumerate(ranked, start=1):
        candidate = item.candidate
        pdf.set_font("Helvetica", "B", 12)
        header = f"{index}. {candidate.name} - {candidate.role}"
        pdf.multi_cell(0, 6, _sanitize(header))

        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(
            0,
            5,
            _sanitize(
                f"Location: {candidate.location} | Experience: {candidate.experience_years} yrs"
            ),
        )

        final_score = round(item.final_score * 100)
        pdf.multi_cell(0, 5, _sanitize(f"Final Score: {final_score}%"))

        if candidate.summary:
            pdf.multi_cell(0, 5, _sanitize(f"Summary: {candidate.summary}"))

        if candidate.skills:
            skills = ", ".join(candidate.skills[:10])
            pdf.multi_cell(0, 5, _sanitize(f"Key Skills: {skills}"))

        if item.strengths:
            pdf.multi_cell(0, 5, _sanitize(f"Strengths: {', '.join(item.strengths)}"))

        if item.gaps:
            pdf.multi_cell(0, 5, _sanitize(f"Gaps: {', '.join(item.gaps)}"))

        if item.transfers:
            transfers = ", ".join(item.transfers[:8])
            pdf.multi_cell(0, 5, _sanitize(f"Transferable: {transfers}"))

        if item.risk_flags:
            pdf.multi_cell(0, 5, _sanitize(f"Risk Flags: {', '.join(item.risk_flags)}"))

        pdf.ln(2)

    output = pdf.output(dest="S")
    if isinstance(output, bytes):
        return output
    return output.encode("latin-1")
