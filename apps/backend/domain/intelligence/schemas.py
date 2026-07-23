from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, UUID4

class Citation(BaseModel):
    id: str
    title: str
    type: str # 'FIR', 'EVIDENCE', 'SUSPECT'
    relevance_score: Optional[float] = None
    url: Optional[str] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    conversation_id: Optional[UUID4] = None
    context_fir_id: Optional[UUID4] = None
    officer_id: UUID4 # Usually injected from auth context

class MessageBase(BaseModel):
    role: str
    content: str
    citations: List[Citation] = []
    timestamp: datetime

class MessageCreate(MessageBase):
    conversation_id: UUID4

class MessageResponse(MessageBase):
    id: UUID4

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: str
    officer_id: UUID4
    context_fir_id: Optional[UUID4] = None

class ConversationCreate(ConversationBase):
    pass

class ConversationUpdate(BaseModel):
    title: Optional[str] = None

class ConversationResponse(ConversationBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class ChatStreamChunk(BaseModel):
    chunk: str
    is_final: bool = False
    confidence_score: Optional[float] = None
    citations: List[Citation] = []
    suggested_questions: List[str] = []
