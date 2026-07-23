import structlog
from typing import List, Dict, Any, Optional

from .retriever import hybrid_retriever
from .ranker import context_ranker

try:
    from langchain_core.documents import Document
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

log = structlog.get_logger()

class RAGPipeline:
    """
    Orchestrates the entire Retrieval-Augmented Generation flow.
    """
    
    async def get_context_for_query(
        self, 
        query: str, 
        filters: Dict[str, Any] = None
    ) -> str:
        """
        Retrieves, ranks, and formats context for the LLM.
        """
        # 1. Retrieve (Hybrid or Semantic)
        documents = await hybrid_retriever.search(query=query, k=10, metadata_filters=filters)
        
        # 2. Rank (select top contexts)
        ranked_docs = context_ranker.rerank(query=query, documents=documents, top_n=4)
        
        # 3. Format Context
        if not ranked_docs:
            return "No relevant evidence or context found."
            
        formatted_context = ""
        for i, doc in enumerate(ranked_docs):
            if HAS_LANGCHAIN:
                source = doc.metadata.get("source", "Unknown")
                content = doc.page_content
                formatted_context += f"--- Document {i+1} [Source: {source}] ---\n{content}\n\n"
            
        return formatted_context

rag_pipeline = RAGPipeline()
