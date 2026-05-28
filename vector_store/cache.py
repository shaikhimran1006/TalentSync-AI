from __future__ import annotations

from typing import Dict, Optional

import json

try:
    import redis.asyncio as redis
except Exception:  # pragma: no cover
    redis = None


class EmbeddingCache:
    def __init__(self, redis_url: Optional[str] = None) -> None:
        self.redis_url = redis_url
        self._local_cache: Dict[str, list] = {}
        self._redis = redis.from_url(redis_url) if redis_url and redis else None

    async def get(self, key: str) -> Optional[list]:
        if key in self._local_cache:
            return self._local_cache[key]
        if self._redis is None:
            return None
        raw = await self._redis.get(key)
        if raw is None:
            return None
        data = json.loads(raw)
        self._local_cache[key] = data
        return data

    async def set(self, key: str, value: list) -> None:
        self._local_cache[key] = value
        if self._redis is None:
            return
        await self._redis.set(key, json.dumps(value))
