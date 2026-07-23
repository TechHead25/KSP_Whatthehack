from fastapi import APIRouter, Depends
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from ....infrastructure.database.catalyst import get_db
from ....core.responses import SuccessResponse
from ....domain.admin.schemas import TelemetryResponse, ActiveSessionResponse, AuditLogResponse
from ....domain.admin.service import admin_service
from ..dependencies import require_role

router = APIRouter(prefix="/admin", tags=["Enterprise Administration"])

@router.get("/monitoring/telemetry", response_model=SuccessResponse[TelemetryResponse])
async def get_system_telemetry(
    officer = Depends(require_role("SUPER_ADMIN"))
):
    """
    Fetches real-time system health, database metrics, and recent error logs.
    """
    data = await admin_service.get_system_telemetry()
    return SuccessResponse(data=data)

@router.get("/sessions", response_model=SuccessResponse[List[ActiveSessionResponse]])
async def get_active_sessions(
    db: AsyncSession = Depends(get_db),
    officer = Depends(require_role("SUPER_ADMIN"))
):
    """
    Fetches active sessions.
    """
    sessions = await admin_service.get_active_sessions(db)
    return SuccessResponse(data=[ActiveSessionResponse.model_validate(s) for s in sessions])

@router.get("/audit", response_model=SuccessResponse[List[AuditLogResponse]])
async def get_audit_logs(
    db: AsyncSession = Depends(get_db),
    officer = Depends(require_role("SUPER_ADMIN", "STATE_ADMIN", "AUDITOR"))
):
    """
    Fetches global audit logs.
    """
    logs = await admin_service.get_audit_logs(db)
    return SuccessResponse(data=[AuditLogResponse.model_validate(l) for l in logs])
