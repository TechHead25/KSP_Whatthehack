from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from ...core.models import Base, UUIDMixin, TimestampMixin

class Conversation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conversations"

    officer_id = Column(ForeignKey("officers.id"), nullable=False)
    title = Column(String(200), nullable=False)
    context_fir_id = Column(ForeignKey("firs.id"), nullable=True)
    
    # Relationships
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.timestamp")
    officer = relationship("Officer")


class Message(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "messages"

    conversation_id = Column(ForeignKey("conversations.id"), nullable=False)
    role = Column(String(20), nullable=False) # 'user' or 'ai'
    content = Column(Text, nullable=False)
    citations = Column(JSONB, default=list) # Array of cited evidence/FIR IDs or URLs
    timestamp = Column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
