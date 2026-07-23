import structlog
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncEngine

try:
    from langchain_postgres.vectorstores import PGVector
    from langchain_core.documents import Document
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

from .embedder import embedder_service
from ...database.catalyst import engine # The SQLAlchemy AsyncEngine

log = structlog.get_logger()

class VectorStoreManager:
    def __init__(self):
        self.vector_store = None
        if HAS_PGVECTOR and embedder_service.embeddings:
            # In LangChain PGVector with AsyncEngine:
            self.vector_store = PGVector(
                embeddings=embedder_service.embeddings,
                collection_name="netra_evidence_store",
                connection=engine,
                use_jsonb=True,
                async_mode=True
            )
            log.info("vector_store_initialized", collection="netra_evidence_store")
        else:
            log.warning("vector_store_not_initialized", reason="Missing PGVector or Embeddings")

    async def add_documents(self, documents: List['Document']):
        if not self.vector_store:
            log.warning("mock_add_documents", count=len(documents))
            return
        await self.vector_store.aadd_documents(documents)

    async def similarity_search(self, query: str, k: int = 4, filter: dict = None) -> List['Document']:
        if not self.vector_store:
            # Mock return
            if not HAS_PGVECTOR:
                return [] # Cannot mock Document object easily without importing it
            from langchain_core.documents import Document
            return [Document(page_content="Mock retrieved context based on local setup.", metadata={"source": "mock"})]
            
        return await self.vector_store.asimilarity_search(query, k=k, filter=filter)

vector_store_manager = VectorStoreManager()
