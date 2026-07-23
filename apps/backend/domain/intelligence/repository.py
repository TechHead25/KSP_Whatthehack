import uuid
from typing import List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.repository import BaseRepository
from .models import Conversation, Message
from .schemas import ConversationCreate, ConversationUpdate, MessageCreate

class ConversationRepository(BaseRepository[Conversation, ConversationCreate, ConversationUpdate]):
    def __init__(self):
        super().__init__(Conversation)

    async def get_by_officer(self, db: AsyncSession, officer_id: uuid.UUID) -> List[Conversation]:
        query = (
            select(self.model)
            .where(self.model.officer_id == officer_id)
            .order_by(desc(self.model.updated_at))
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_with_messages(self, db: AsyncSession, conversation_id: uuid.UUID) -> Conversation:
        query = (
            select(self.model)
            .where(self.model.id == conversation_id)
            .options(selectinload(self.model.messages))
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

class MessageRepository(BaseRepository[Message, MessageCreate, MessageCreate]): # No update for messages typically
    def __init__(self):
        super().__init__(Message)

    async def get_recent_messages(self, db: AsyncSession, conversation_id: uuid.UUID, limit: int = 10) -> List[Message]:
        query = (
            select(self.model)
            .where(self.model.conversation_id == conversation_id)
            .order_by(desc(self.model.timestamp))
            .limit(limit)
        )
        result = await db.execute(query)
        messages = list(result.scalars().all())
        # Return in chronological order
        messages.reverse()
        return messages

# Initialize instances
conversation_repo = ConversationRepository()
message_repo = MessageRepository()
