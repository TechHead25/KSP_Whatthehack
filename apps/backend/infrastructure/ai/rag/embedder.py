import os
from typing import List
import structlog
from core.config import get_settings

# Try to import Langchain Google GenAI
try:
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

log = structlog.get_logger()
settings = get_settings()

class EmbedderService:
    def __init__(self):
        self.embeddings = None
        if HAS_LANGCHAIN and hasattr(settings, "GEMINI_API_KEY") and settings.GEMINI_API_KEY:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.GEMINI_API_KEY
            )
            log.info("embedder_initialized", model="models/embedding-001")
        else:
            log.warning("embedder_not_initialized", reason="Missing API key or LangChain")

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not self.embeddings:
            # Return mock vectors for local testing without API keys
            return [[0.1] * 1536 for _ in texts]
        return self.embeddings.embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        if not self.embeddings:
            return [0.1] * 1536
        return self.embeddings.embed_query(text)

embedder_service = EmbedderService()
