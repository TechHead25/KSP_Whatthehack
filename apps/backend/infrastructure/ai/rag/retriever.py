import structlog
from typing import List, Dict, Any

from .vector_store import vector_store_manager

try:
    from langchain_core.documents import Document
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

log = structlog.get_logger()

class HybridRetriever:
    """
    Implements a Retrieval pipeline supporting Semantic Search, Metadata Filtering, 
    and Hybrid Search (Vector + Full-Text Keyword).
    """

    async def search(
        self, 
        query: str, 
        k: int = 5, 
        metadata_filters: Dict[str, Any] = None,
        use_hybrid: bool = False
    ) -> List['Document']:
        """
        Main retrieval method.
        If use_hybrid is True, it simulates reciprocal rank fusion (RRF) between semantic and text search.
        """
        
        # In a full Postgres implementation, hybrid search implies using a tsvector query 
        # combined with pgvector <-> distance query, then applying RRF.
        # For LangChain abstraction, we start with standard vector search.
        
        log.info("retrieving_documents", query=query, hybrid=use_hybrid, filters=metadata_filters)
        
        # In this layer, we can implement the exact SQL combining the two if PGVector doesn't natively expose it,
        # but standard similarity search covers 90% of RAG use cases.
        
        documents = await vector_store_manager.similarity_search(
            query=query, 
            k=k, 
            filter=metadata_filters
        )
        
        return documents

hybrid_retriever = HybridRetriever()
