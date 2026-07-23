# ============================================================
# NETRA AI — Rate Limiting Middleware
# ============================================================
import time
import structlog
from typing import Callable, Awaitable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from infrastructure.database.redis import redis_manager

log = structlog.get_logger()

from core.security import decode_token

# Per API_SPEC.md §14 (Limits per minute)
ROLE_LIMITS = {
    "SUPER_ADMIN": 1000,
    "STATE_ADMIN": 500,
    "DISTRICT_ADMIN": 200,
    "INVESTIGATION_OFFICER": 200,
    "POLICE_OFFICER": 60,
    "READ_ONLY_OFFICER": 100,
    "AUDITOR": 200,
    "DEFAULT": 20 # Fallback/unauthenticated
}

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Redis-based rate limiting middleware.
    """
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        
        auth_header = request.headers.get("authorization", "")
        if auth_header.startswith("Bearer "):
            try:
                token = auth_header[7:]
                claims = decode_token(token)
                role = claims.get("role", "DEFAULT")
                identifier = f"user:{claims.get('sub')}"
                limit = ROLE_LIMITS.get(role, ROLE_LIMITS["DEFAULT"])
            except Exception:
                identifier = f"token:{auth_header[-10:]}"
                limit = ROLE_LIMITS["DEFAULT"] 
        else:
            identifier = f"ip:{client_ip}"
            limit = ROLE_LIMITS["DEFAULT"]

        # Redis rate limiting logic (Token Bucket / Fixed Window)
        if redis_manager.redis:
            current_minute = int(time.time() // 60)
            key = f"ratelimit:{identifier}:{current_minute}"
            
            try:
                # Increment counter
                current_count = await redis_manager.redis.incr(key)
                if current_count == 1:
                    await redis_manager.redis.expire(key, 60) # Expire in 60s
                
                if current_count > limit:
                    log.warning("rate_limit_exceeded", identifier=identifier, count=current_count)
                    return JSONResponse(
                        status_code=429,
                        content={
                            "success": False,
                            "error": {
                                "code": "RATE_LIMIT_EXCEEDED",
                                "message": "Too many requests. Please try again later.",
                            }
                        }
                    )
            except Exception as e:
                # If Redis fails, fail open (allow request) to prevent blocking the app
                log.error("rate_limit_redis_error", error=str(e))
                
        return await call_next(request)
