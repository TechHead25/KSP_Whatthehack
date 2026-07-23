import uuid
from typing import List
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from sqlalchemy.ext.asyncio import AsyncSession
from ....infrastructure.database.catalyst import get_db
from ....core.responses import SuccessResponse

from ....domain.intelligence.schemas import ChatRequest, ConversationResponse, MessageResponse
from ....domain.intelligence.service import ai_service
from ....domain.intelligence.repository import conversation_repo, message_repo

router = APIRouter(prefix="/intelligence", tags=["AI Intelligence"])

@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Stream a response from the AI Intelligence Assistant.
    Yields Server-Sent Events (SSE) containing ChatStreamChunk JSON.
    """
    return StreamingResponse(
        ai_service.generate_chat_stream(db, request), 
        media_type="text/event-stream"
    )

@router.get("/conversations", response_model=SuccessResponse[List[ConversationResponse]])
async def list_conversations(
    officer_id: uuid.UUID, # In reality, from JWT Context
    db: AsyncSession = Depends(get_db)
):
    """List recent AI chat conversations for the officer."""
    conversations = await conversation_repo.get_by_officer(db, officer_id=officer_id)
    return SuccessResponse(
        data=[ConversationResponse.model_validate(c) for c in conversations]
    )

@router.get("/conversations/{conversation_id}", response_model=SuccessResponse[ConversationResponse])
async def get_conversation(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a conversation with its full message history."""
    conv = await conversation_repo.get_with_messages(db, conversation_id=conversation_id)
    if not conv:
        # In real code, throw a 404 Exception here
        return SuccessResponse(data=None, message="Conversation not found")
        
    return SuccessResponse(
        data=ConversationResponse.model_validate(conv)
    )
