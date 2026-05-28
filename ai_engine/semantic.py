from __future__ import annotations

from typing import List

import numpy as np


def cosine_similarity(query: np.ndarray, candidates: np.ndarray) -> List[float]:
    if query.size == 0 or candidates.size == 0:
        return []
    scores = np.dot(candidates, query.T).reshape(-1)
    return [float(score) for score in scores]
