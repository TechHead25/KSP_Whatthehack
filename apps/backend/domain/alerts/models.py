from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB

from core.models import Base, UUIDMixin, TimestampMixin

class NotificationHistory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notification_history"

    officer_id = Column(ForeignKey("officers.id"), nullable=False, index=True)
    alert_type = Column(String(50), nullable=False, index=True) # CRIME_SPIKE, REPEAT_OFFENDER, GANG_DETECTION, AREA_RISK
    channel = Column(String(20), nullable=False) # EMAIL, SMS, PUSH
    status = Column(String(20), default="SENT") # SENT, FAILED
    
    # Store the complex message payload native JSON
    payload = Column(JSONB, nullable=False)
