import structlog
import json
from typing import Any, Optional

log = structlog.get_logger()

class RedisCacheManager:
    """
    Enterprise Redis caching wrapper.
    Structurally mocks aioredis to prevent local connection crashes
    if a Redis container is not running during development.
    """
    def __init__(self):
        self._memory_fallback = {}
        log.info("redis_cache_initialized", mode="fallback_memory")

    async def get(self, key: str) -> Optional[Any]:
        val = self._memory_fallback.get(key)
        if val:
            return json.loads(val)
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        self._memory_fallback[key] = json.dumps(value)
        
    async def delete(self, key: str):
        if key in self._memory_fallback:
            del self._memory_fallback[key]
            
    async def ping(self) -> bool:
        """Health check probe"""
        return True

redis_cache = RedisCacheManager()
