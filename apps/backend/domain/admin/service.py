import structlog
from typing import List, Dict, Any
from datetime import datetime, timezone

from .schemas import TelemetryResponse, DatabaseHealthMetric, LogEntry

log = structlog.get_logger()

class AdminService:
    """
    Orchestrates administration logic and telemetry fetching.
    """

    async def get_system_telemetry(self) -> TelemetryResponse:
        log.info("fetching_system_telemetry")
        
        # Simulating DB Monitoring metrics
        db_metrics = [
            DatabaseHealthMetric(metric_name="Connection Pool", value="45/100", status="HEALTHY"),
            DatabaseHealthMetric(metric_name="Query Latency (avg)", value="42ms", status="HEALTHY"),
            DatabaseHealthMetric(metric_name="Vector Store Index Size", value="1.2GB", status="HEALTHY"),
            DatabaseHealthMetric(metric_name="Deadlocks (24h)", value="0", status="HEALTHY")
        ]
        
        # Simulating recent ERROR logs from the ELK/Datadog stack
        logs = [
            LogEntry(
                timestamp=datetime.now(timezone.utc),
                level="ERROR",
                service="prediction_service",
                message="Timeout reaching external Catalyst embedding endpoint."
            )
        ]
        
        return TelemetryResponse(
            database_metrics=db_metrics,
            recent_errors=logs
        )

    async def get_active_sessions(self, db) -> List[Any]:
        from sqlalchemy import select
        from ..shared.models import Session
        result = await db.execute(
            select(Session)
            .where(Session.is_active == True)
            .order_by(Session.created_at.desc())
            .limit(100)
        )
        return result.scalars().all()

    async def get_audit_logs(self, db) -> List[Any]:
        from sqlalchemy import select
        from ..shared.models import AuditLog
        result = await db.execute(
            select(AuditLog)
            .order_by(AuditLog.created_at.desc())
            .limit(100)
        )
        return result.scalars().all()

admin_service = AdminService()
