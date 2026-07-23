# ============================================================
# NETRA AI — Redis Connection Manager (Catalyst Cache)
# ============================================================
import structlog
from redis import asyncio as aioredis
from ...core.config import get_settings

settings = get_settings()
log = structlog.get_logger()

class RedisManager:
    """Manages the Redis connection pool."""
    def __init__(self):
        self.redis: aioredis.Redis | None = None

    async def connect(self):
        """Initialize the Redis connection pool."""
        if not settings.redis_url:
            log.warning("redis_url_missing", msg="Redis caching disabled. Running in degraded mode.")
            return

        try:
            self.redis = aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=10
            )
            await self.redis.ping()
            log.info("redis_connected", url=settings.redis_url)
        except Exception as e:
            log.error("redis_connection_failed", error=str(e))
            self.redis = None

    async def disconnect(self):
        """Close the Redis connection pool."""
        if self.redis:
            await self.redis.close()
            log.info("redis_disconnected")
            self.redis = None

    async def get(self, key: str) -> str | None:
        if not self.redis:
            return None
        return await self.redis.get(key)

    async def set(self, key: str, value: str, ex: int | None = None):
        if not self.redis:
            return
        await self.redis.set(key, value, ex=ex)


# Global Redis manager instance
redis_manager = RedisManager()
