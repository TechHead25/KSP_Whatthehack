# ============================================================
# NETRA AI — FastAPI Application Entry Point
# ============================================================
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os

import sys

print("=" * 60, flush=True)
print("      NETRA AI — ZOHO CATALYST APPSAIL BACKEND", flush=True)
print("=" * 60, flush=True)

print("\n[DIAGNOSTICS] Current Working Directory:", os.getcwd(), flush=True)
print("\n[DIAGNOSTICS] Directory Listing:", os.listdir('.'), flush=True)

print("\n[DIAGNOSTICS] Recursive file tree:", flush=True)
for root, dirs, files in os.walk('.'):
    for name in files:
        print(os.path.join(root, name))
        
print("\n[DIAGNOSTICS] Python executable:", sys.executable, flush=True)
print("\n[DIAGNOSTICS] Python version:", sys.version, flush=True)

print("\n[DIAGNOSTICS] Environment variables:", flush=True)
for k, v in os.environ.items():
    print(f"{k}={v}")
    
print("\n[DIAGNOSTICS] sys.path:", sys.path, flush=True)

print("\n[DIAGNOSTICS] Location of main.py:", os.path.abspath(__file__), flush=True)

print("\n[DIAGNOSTICS] Current command:", sys.argv, flush=True)
print("=" * 60, flush=True)

import structlog
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from api.v1.routers.auth import router as auth_router
from api.v1.routers.fir import router as fir_router
from api.v1.routers.evidence import router as evidence_router
from api.v1.routers.intelligence import router as intelligence_router
from api.v1.routers.graph import router as graph_router
from api.v1.routers.suspects import router as suspects_router
from api.v1.routers.analytics import router as analytics_router
from api.v1.routers.prediction import router as prediction_router
from api.v1.routers.patrol import router as patrol_router
from api.v1.routers.reporting import router as reporting_router
from api.v1.routers.admin import router as admin_router
from api.v1.routers.alerts import router as alerts_router
from api.v1.routers.search import router as search_router
from api.v1.routers.dashboard import router as dashboard_router
from api.v1.routers.health import router as health_router
from api.middleware.audit import AuditLoggingMiddleware
from api.middleware.rate_limit import RateLimitMiddleware
from infrastructure.database.neo4j import neo4j_manager
from infrastructure.database.redis import redis_manager
from core.config import get_settings
from core.exceptions import NETRABaseException
from api.v1.dependencies import get_current_officer

log = structlog.get_logger()
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("netra_ai_starting", version=settings.app_version, env=settings.environment)
    try:
        await neo4j_manager.connect()
    except Exception as e:
        log.warning("neo4j_connection_warning", error=str(e))

    try:
        await redis_manager.connect()
    except Exception as e:
        log.warning("redis_connection_warning", error=str(e))

    yield

    try:
        await neo4j_manager.disconnect()
    except Exception as e:
        log.warning("neo4j_disconnect_warning", error=str(e))

    try:
        await redis_manager.disconnect()
    except Exception as e:
        log.warning("redis_disconnect_warning", error=str(e))

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
uploads_dir = os.path.join(os.getcwd(), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# ── Middlewares (CORSMiddleware MUST be added LAST to execute OUTERMOST) ──────
app.add_middleware(RateLimitMiddleware)
app.add_middleware(AuditLoggingMiddleware)

allowed_origins = list(set(settings.cors_origins + [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

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
