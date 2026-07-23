from pydantic import BaseModel, UUID4
from typing import Dict, Any, List
from datetime import datetime

class RoleSchema(BaseModel):
    id: UUID4
    name: str
    description: str
    permissions: Dict[str, Any]

class SystemSettingSchema(BaseModel):
    key: str
    value: Dict[str, Any]
    description: str

class FeatureFlagSchema(BaseModel):
    name: str
    is_enabled: bool
    description: str

# Structural Mocks for Telemetry
class DatabaseHealthMetric(BaseModel):
    metric_name: str
    value: str
    status: str # 'HEALTHY', 'WARNING', 'CRITICAL'

class LogEntry(BaseModel):
    timestamp: datetime
    level: str
    service: str
    message: str

class TelemetryResponse(BaseModel):
    database_metrics: List[DatabaseHealthMetric]
    recent_errors: List[LogEntry]

class ActiveSessionResponse(BaseModel):
    id: UUID4
    officer_id: UUID4
    is_active: bool
    expires_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: UUID4
    officer_id: UUID4 | None
    action: str
    resource: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
