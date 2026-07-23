from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.models import Base, UUIDMixin, TimestampMixin

class Evidence(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "evidence"

    fir_id = Column(ForeignKey("firs.id"), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    file_url = Column(String(500))
    collected_by = Column(ForeignKey("officers.id"))
    collected_at = Column(DateTime(timezone=True))
    chain_of_custody = Column(JSONB, default=list) # Append-only log of access/modifications
    is_verified = Column(Boolean, default=False)
    metadata_ = Column("metadata", JSONB, default=dict) # Hash, mime type, size, etc.

    # Using string references since models are in different files now
    fir = relationship("FIR", back_populates="evidence")
    officer = relationship("Officer")
