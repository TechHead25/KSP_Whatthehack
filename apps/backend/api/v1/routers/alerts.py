import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from infrastructure.database.catalyst import get_db
from core.responses import SuccessResponse
from domain.alerts.schemas import NotificationHistoryResponse, NotificationTriggerRequest
from domain.alerts.service import alert_dispatcher

router = APIRouter(prefix="/alerts", tags=["Early Warning System"])

@router.get("/history/{officer_id}", response_model=SuccessResponse[List[NotificationHistoryResponse]])
async def get_alert_history(officer_id: str, db: AsyncSession = Depends(get_db)):
    """
    Fetches the notification history for a specific officer.
    """
    history = await alert_dispatcher.get_history_for_officer(db, uuid.UUID(officer_id))
    return SuccessResponse(data=history)

@router.post("/trigger-test", response_model=SuccessResponse[List[NotificationHistoryResponse]])
async def trigger_test_alert(
    officer_id: str, 
    request: NotificationTriggerRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Manually triggers an Early Warning System alert (Email/SMS/Push) to a specific officer.
    Used by the UI for testing the notification channels.
    """
    dispatched = await alert_dispatcher.dispatch_alert(db, uuid.UUID(officer_id), request)
    return SuccessResponse(data=dispatched, message="Alert successfully dispatched.")
