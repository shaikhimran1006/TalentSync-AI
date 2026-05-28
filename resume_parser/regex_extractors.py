from __future__ import annotations

import re
from typing import Dict, List


SECTION_HEADERS = ["summary", "experience", "skills", "education", "certifications", "projects"]


def extract_sections(text: str) -> Dict[str, str]:
    lowered = text.lower()
    sections: Dict[str, str] = {key: "" for key in SECTION_HEADERS}
    for header in SECTION_HEADERS:
        pattern = rf"{header}\\n([\\s\\S]*?)(?=\\n\\w|$)"
        match = re.search(pattern, lowered)
        if match:
            sections[header] = match.group(1).strip()
    return sections


def extract_bullets(text: str) -> List[str]:
    bullets = re.findall(r"-\s+(.*)", text)
    return [bullet.strip() for bullet in bullets if bullet.strip()]
