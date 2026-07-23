import json
import uuid
import asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from ...core.config import get_settings
from ...core.exceptions import NETRABaseException

from .models import Conversation, Message
from .repository import conversation_repo, message_repo
from .schemas import ChatRequest, ChatStreamChunk, Citation
from .prompts import get_chat_prompt
from ...infrastructure.ai.rag.pipeline import rag_pipeline

# Optional fallback if LangChain/Gemini SDKs are not fully installed in local env
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import HumanMessage, AIMessage
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

log = structlog.get_logger()
settings = get_settings()

class IntelligenceService:
    def __init__(self):
        # We initialize the LLM lazily or handle fallback for missing API keys
        self.llm = None
        if HAS_LANGCHAIN and hasattr(settings, "GEMINI_API_KEY") and settings.GEMINI_API_KEY:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-pro",
                temperature=0.2,
                google_api_key=settings.GEMINI_API_KEY,
                streaming=True
            )

    async def generate_chat_stream(
        self, db: AsyncSession, request: ChatRequest
    ) -> AsyncGenerator[str, None]:
        
        # 1. Handle Conversation Persistence
        if not request.conversation_id:
            # Create a new conversation
            conv = Conversation(
                officer_id=request.officer_id,
                title=request.message[:50] + "...",
                context_fir_id=request.context_fir_id
            )
            db.add(conv)
            await db.commit()
            await db.refresh(conv)
            conversation_id = conv.id
        else:
            conversation_id = request.conversation_id
            
        # Save user message
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=request.message,
            timestamp=datetime.now(timezone.utc)
        )
        db.add(user_msg)
        await db.commit()

        # 2. Retrieve Context via RAG Pipeline
        investigation_context = "No specific context provided."
        citations = []
        if request.context_fir_id:
            # We filter the RAG pipeline by the FIR ID to ensure context isolation
            filters = {"fir_id": str(request.context_fir_id)}
            investigation_context = await rag_pipeline.get_context_for_query(
                query=request.message,
                filters=filters
            )
            # In a real implementation, RAGPipeline returns the documents, and we extract citations here
            citations.append(Citation(id="RAG-1", title="Retrieved Context", type="EVIDENCE", relevance_score=0.92))

        # 3. Retrieve Chat History
        recent_msgs = await message_repo.get_recent_messages(db, conversation_id, limit=5)
        history = []
        if HAS_LANGCHAIN:
            for m in recent_msgs:
                if m.role == "user":
                    history.append(HumanMessage(content=m.content))
                else:
                    history.append(AIMessage(content=m.content))

        # 4. Stream Response (Using Gemini/LangChain if available, else Mock)
        full_response = ""
        
        if self.llm:
            prompt = get_chat_prompt()
            chain = prompt | self.llm
            
            # Format inputs
            inputs = {
                "officer_rank": "Inspector", # Normally fetch from Officer model
                "officer_name": "User",
                "investigation_context": investigation_context,
                "history": history,
                "message": request.message
            }
            
            # Stream from LangChain
            async for chunk in chain.astream(inputs):
                content = chunk.content
                full_response += content
                
                # Yield SSE formatted string
                stream_chunk = ChatStreamChunk(chunk=content)
                yield f"data: {stream_chunk.model_dump_json()}\n\n"
        else:
            # Mock streaming fallback for local dev without API keys
            log.warning("using_mock_llm", reason="No Gemini API key or LangChain not installed")
            mock_words = f"Based on the context, here is a detailed analysis of the evidence for FIR {request.context_fir_id}. ".split(" ")
            for word in mock_words:
                content = word + " "
                full_response += content
                stream_chunk = ChatStreamChunk(chunk=content)
                yield f"data: {stream_chunk.model_dump_json()}\n\n"
                await asyncio.sleep(0.05)

        # 5. Final Chunk with Metadata
        final_chunk = ChatStreamChunk(
            chunk="",
            is_final=True,
            confidence_score=0.88,
            citations=citations,
            suggested_questions=["What is the link to the suspect?", "Summarize the witness testimony."]
        )
        yield f"data: {final_chunk.model_dump_json()}\n\n"

        # 6. Save AI Response to DB
        ai_msg = Message(
            conversation_id=conversation_id,
            role="ai",
            content=full_response,
            citations=[c.model_dump() for c in citations],
            timestamp=datetime.now(timezone.utc)
        )
        db.add(ai_msg)
        await db.commit()

ai_service = IntelligenceService()
