from __future__ import annotations

from typing import List, Tuple

import numpy as np

try:
    import faiss
except Exception as exc:  # pragma: no cover - optional dependency
    faiss = None
    _faiss_error = exc


class FaissVectorStore:
    def __init__(self, dimension: int) -> None:
        if faiss is None:
            raise ImportError("faiss is required for vector search") from _faiss_error
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension)
        self.ids: List[str] = []

    def add(self, vectors: np.ndarray, ids: List[str]) -> None:
        if vectors.shape[1] != self.dimension:
            raise ValueError("Vector dimension mismatch")
        self.index.add(vectors)
        self.ids.extend(ids)

    def search(self, query_vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        if query_vector.ndim == 1:
            query_vector = query_vector.reshape(1, -1)
        scores, indices = self.index.search(query_vector, top_k)
        results: List[Tuple[str, float]] = []
        for idx, score in zip(indices[0], scores[0]):
            if idx < 0 or idx >= len(self.ids):
                continue
            results.append((self.ids[idx], float(score)))
        return results
