# ============================================================
# NETRA AI — FastAPI Application Entry Point
# ============================================================
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from .api.v1.routers.auth import router as auth_router
from .api.v1.routers.fir import router as fir_router
from .api.v1.routers.evidence import router as evidence_router
from .api.v1.routers.intelligence import router as intelligence_router
from .api.v1.routers.graph import router as graph_router
from .api.v1.routers.suspects import router as suspects_router
from .api.v1.routers.analytics import router as analytics_router
from .api.v1.routers.prediction import router as prediction_router
from .api.v1.routers.patrol import router as patrol_router
from .api.v1.routers.reporting import router as reporting_router
from .api.v1.routers.admin import router as admin_router
from .api.v1.routers.alerts import router as alerts_router
from .api.v1.routers.search import router as search_router
from .api.v1.routers.dashboard import router as dashboard_router
from .api.v1.routers.health import router as health_router
from .api.middleware.audit import AuditLoggingMiddleware
from .api.middleware.rate_limit import RateLimitMiddleware
from .infrastructure.database.neo4j import neo4j_manager
from .infrastructure.database.redis import redis_manager
from .core.config import get_settings
from .core.exceptions import NETRABaseException

log = structlog.get_logger()
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("netra_ai_starting", version=settings.app_version, env=settings.environment)
    await neo4j_manager.connect()
    await redis_manager.connect()
    yield
    await neo4j_manager.disconnect()
    await redis_manager.disconnect()
    log.info("netra_ai_shutdown")


app = FastAPI(
    title="NETRA AI Backend",
    description="Network Enhanced Threat Recognition & Analysis — Karnataka State Police",
    version=settings.app_version,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    swagger_ui_parameters={"persistAuthorization": True},
    lifespan=lifespan,
)

# ── Static Files ─────────────────────────────────────────────
# Ensure uploads directory exists
uploads_dir = os.path.join(os.getcwd(), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# ── CORS ─────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuditLoggingMiddleware)

# ── Exception handlers ───────────────────────────────────────

@app.exception_handler(NETRABaseException)
async def netra_exception_handler(request: Request, exc: NETRABaseException):
    return JSONResponse(
        status_code=exc.http_status,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    log.error("unhandled_exception", exc=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )

from .api.v1.dependencies import get_current_officer
from fastapi import Depends

# ── Routers ──────────────────────────────────────────────────

app.include_router(auth_router, prefix="/api/v1")
app.include_router(fir_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(evidence_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(intelligence_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(graph_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(suspects_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(analytics_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(prediction_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(patrol_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(reporting_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(admin_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(alerts_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(search_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(dashboard_router, prefix="/api/v1", dependencies=[Depends(get_current_officer)])
app.include_router(health_router, prefix="/api/v1")

# ── Health check ─────────────────────────────────────────────

@app.get("/health", tags=["System"])
async def health():
    return {
        "status": "healthy",
        "service": "NETRA AI Backend",
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
