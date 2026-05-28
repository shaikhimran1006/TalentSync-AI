from __future__ import annotations

from typing import List, Tuple

from sentence_transformers import CrossEncoder


class CrossEncoderReranker:
    def __init__(self, model_name: str) -> None:
        self.model_name = model_name
        self.model = CrossEncoder(model_name)

    def score(self, query: str, documents: List[str]) -> List[float]:
        if not documents:
            return []
        pairs: List[Tuple[str, str]] = [(query, doc) for doc in documents]
        scores = self.model.predict(pairs)
        return [float(score) for score in scores]
