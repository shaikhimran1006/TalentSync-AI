from __future__ import annotations

from typing import Dict


def compute_final_score(scores: Dict[str, float], weights: Dict[str, float]) -> float:
    total = 0.0
    for key, weight in weights.items():
        total += scores.get(key, 0.0) * weight
    return round(total, 4)
