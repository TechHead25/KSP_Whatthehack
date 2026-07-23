# ============================================================
# NETRA AI — Audit Logging Middleware
# ============================================================
import time
import structlog
from typing import Callable, Awaitable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

log = structlog.get_logger()

class AuditLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log every API request for auditing purposes per SECURITY.md.
    """
    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        start_time = time.time()
        
        # We don't have access to the parsed JWT here yet (unless we parse it manually), 
        # but we can capture IP, User-Agent, and the endpoint accessed.
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        path = request.url.path
        method = request.method

        try:
            response = await call_next(request)
            process_time_ms = int((time.time() - start_time) * 1000)
            
            # Log success
            log.info(
                "audit_log",
                method=method,
                path=path,
                status_code=response.status_code,
                ip=client_ip,
                user_agent=user_agent,
                duration_ms=process_time_ms
            )
            return response
            
        except Exception as e:
            process_time_ms = int((time.time() - start_time) * 1000)
            # Log failure
            log.error(
                "audit_log_error",
                method=method,
                path=path,
                error=str(e),
                ip=client_ip,
                duration_ms=process_time_ms
            )
            raise
