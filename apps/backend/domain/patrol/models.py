from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB

from core.models import Base, UUIDMixin, TimestampMixin

class PatrolSchedule(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "patrol_schedules"

    officer_id = Column(ForeignKey("officers.id"), nullable=False, index=True)
    district_id = Column(ForeignKey("districts.id"), nullable=False, index=True)
    
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    status = Column(String(50), default="SCHEDULED") # SCHEDULED, IN_PROGRESS, COMPLETED
    
    # Store the complex list of waypoints and priorities as a JSONB array
    route_waypoints = Column(JSONB, default=list)
