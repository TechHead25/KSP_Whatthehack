import structlog
from typing import List, Dict, Any

try:
    from langchain_core.documents import Document
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False

log = structlog.get_logger()

class DocumentProcessor:
    def __init__(self):
        if HAS_LANGCHAIN:
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
                is_separator_regex=False,
            )
        else:
            self.text_splitter = None

    def process_text(self, text: str, metadata: Dict[str, Any]) -> List['Document']:
        """
        Splits raw text into semantically coherent chunks and attaches metadata.
        """
        if not HAS_LANGCHAIN:
            log.warning("mock_process_text")
            return []
            
        chunks = self.text_splitter.split_text(text)
        
        documents = []
        for i, chunk in enumerate(chunks):
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = i
            documents.append(Document(page_content=chunk, metadata=chunk_metadata))
            
        log.info("document_processed", num_chunks=len(documents))
        return documents

document_processor = DocumentProcessor()
