from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import fitz
import spacy
from docx import Document

from resume_parser.regex_extractors import extract_bullets, extract_sections
from resume_parser.skills import SKILL_KEYWORDS

_NLP = None


def _get_nlp() -> spacy.language.Language:
    global _NLP
    if _NLP is None:
        _NLP = spacy.load("en_core_web_sm")
    return _NLP


def extract_text_from_pdf(file_path: Path) -> str:
    text_chunks: List[str] = []
    with fitz.open(file_path) as doc:
        for page in doc:
            text_chunks.append(page.get_text())
    return "\n".join(text_chunks)


def extract_text_from_docx(file_path: Path) -> str:
    document = Document(file_path)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)


def parse_resume_text(text: str) -> Dict[str, object]:
    lowered = text.lower()
    sections = extract_sections(text)
    skills = [skill for skill in SKILL_KEYWORDS if skill.lower() in lowered]
    bullets = extract_bullets(text)

    leadership_indicators = [phrase for phrase in ["lead", "mentor", "managed", "owned"] if phrase in lowered]
    achievement_signals = [phrase for phrase in ["improved", "increased", "reduced", "%"] if phrase in lowered]
    collaboration_indicators = [phrase for phrase in ["collaborated", "cross-functional", "partnered"] if phrase in lowered]

    nlp = _get_nlp()
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents if ent.label_ in {"ORG", "PERSON", "GPE"}]

    return {
        "skills": skills,
        "education": sections.get("education", ""),
        "certifications": sections.get("certifications", ""),
        "projects": sections.get("projects", ""),
        "experience": sections.get("experience", ""),
        "tools": skills,
        "domains": [],
        "leadership_indicators": leadership_indicators,
        "achievement_signals": achievement_signals,
        "project_complexity": "high" if "distributed" in lowered or "scalable" in lowered else "medium",
        "collaboration_indicators": collaboration_indicators,
        "entities": entities,
        "bullets": bullets,
    }


def parse_resume_file(file_path: Path) -> Dict[str, object]:
    if file_path.suffix.lower() == ".pdf":
        text = extract_text_from_pdf(file_path)
    elif file_path.suffix.lower() == ".docx":
        text = extract_text_from_docx(file_path)
    else:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
    return parse_resume_text(text)
