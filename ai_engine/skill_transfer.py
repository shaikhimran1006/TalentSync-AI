from __future__ import annotations

from typing import Dict, List


SKILL_TRANSFER_MAP: Dict[str, List[str]] = {
    "PyTorch": ["TensorFlow", "JAX"],
    "TensorFlow": ["PyTorch", "JAX"],
    "Docker": ["Kubernetes", "Containerd"],
    "AWS": ["GCP", "Azure"],
    "React Native": ["Flutter", "Mobile Architecture"],
    "FAISS": ["Pinecone", "Weaviate", "Milvus"],
    "FastAPI": ["Django", "Flask", "Starlette"],
}


def infer_transferable_skills(skills: List[str]) -> Dict[str, List[str]]:
    transfers: Dict[str, List[str]] = {}
    for skill in skills:
        if skill in SKILL_TRANSFER_MAP:
            transfers[skill] = SKILL_TRANSFER_MAP[skill]
    return transfers
