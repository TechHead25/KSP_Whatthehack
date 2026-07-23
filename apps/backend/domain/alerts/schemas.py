from enum import Enum
from pydantic import BaseModel, UUID4
from typing import Dict, Any, Optional
from datetime import datetime

class AlertType(str, Enum):
    CRIME_SPIKE = "CRIME_SPIKE"
    REPEAT_OFFENDER = "REPEAT_OFFENDER"
    GANG_DETECTION = "GANG_DETECTION"
    AREA_RISK = "AREA_RISK"

class NotificationChannel(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    PUSH = "PUSH"
    ALL = "ALL"

class AlertPayload(BaseModel):
    message: str
    severity: str # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    location: Optional[str] = None
    metadata: Dict[str, Any] = {}

class NotificationTriggerRequest(BaseModel):
    alert_type: AlertType
    channel: NotificationChannel
    payload: AlertPayload

class NotificationHistoryResponse(BaseModel):
    id: UUID4
    officer_id: UUID4
    alert_type: str
    channel: str
    status: str
    payload: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True
