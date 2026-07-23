import structlog
import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import NotificationTriggerRequest, AlertType, NotificationChannel
from .models import NotificationHistory
from ..shared.models import Officer

log = structlog.get_logger()

class AlertDispatcherService:
    """
    Handles formatting and dispatching physical notifications (Email, SMS, Push).
    """

    async def _mock_dispatch(self, db: AsyncSession, officer_id: uuid.UUID, request: NotificationTriggerRequest, target_channel: NotificationChannel):
        log.info(f"dispatching_{target_channel.value.lower()}", officer_id=str(officer_id), alert_type=request.alert_type.value)
        
        # In a real scenario, we'd hit Twilio, SendGrid, or Firebase here.
        # We structurally mock success and log to the database.
        
        history = NotificationHistory(
            officer_id=officer_id,
            alert_type=request.alert_type.value,
            channel=target_channel.value,
            status="SENT",
            payload=request.payload.model_dump()
        )
        
        db.add(history)
        await db.commit()
        await db.refresh(history)
        return history

    async def dispatch_alert(self, db: AsyncSession, officer_id: uuid.UUID, request: NotificationTriggerRequest):
        """
        Dispatches an alert to one or multiple channels.
        """
        dispatched = []
        
        channels = [request.channel]
        if request.channel == NotificationChannel.ALL:
            channels = [NotificationChannel.EMAIL, NotificationChannel.SMS, NotificationChannel.PUSH]
            
        for ch in channels:
            res = await self._mock_dispatch(db, officer_id, request, ch)
            dispatched.append(res)
            
        return dispatched
        
    async def get_history_for_officer(self, db: AsyncSession, officer_id: uuid.UUID) -> List[NotificationHistory]:
        query = select(NotificationHistory).where(
            NotificationHistory.officer_id == officer_id
        ).order_by(NotificationHistory.created_at.desc())
        
        result = await db.execute(query)
        return list(result.scalars().all())

alert_dispatcher = AlertDispatcherService()
