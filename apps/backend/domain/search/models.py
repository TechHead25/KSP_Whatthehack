from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB

from ...core.models import Base, UUIDMixin, TimestampMixin

class RecentSearch(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "recent_searches"

    officer_id = Column(ForeignKey("officers.id"), nullable=False, index=True)
    query_string = Column(String(255), nullable=False, index=True)
    
    # Store applied filters natively for re-hydration in the UI
    filters = Column(JSONB, default=dict)
