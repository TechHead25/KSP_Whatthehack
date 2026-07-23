# ============================================================
# NETRA AI — File Storage Abstraction (Catalyst File Store)
# ============================================================
import structlog
import os
import aiofiles
from typing import BinaryIO
from pathlib import Path
from ...core.config import get_settings

settings = get_settings()
log = structlog.get_logger()

class FileStoreManager:
    """
    Abstraction layer for Catalyst File Store.
    Allows easy swapping to local storage or S3 during local development.
    """
    
    async def upload_file(self, file_name: str, file_data: bytes, content_type: str) -> str:
        """
        Uploads a file locally and returns its URI.
        """
        # Save to local uploads directory
        uploads_dir = Path(os.getcwd()) / "uploads"
        uploads_dir.mkdir(parents=True, exist_ok=True)
        
        # In a real app we should make the filename unique to avoid collisions
        safe_name = f"{file_name.replace(' ', '_')}"
        file_path = uploads_dir / safe_name
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            await out_file.write(file_data)
            
        log.info("file_uploaded_locally", file_name=safe_name, content_type=content_type, path=str(file_path))
        return f"http://localhost:8000/static/uploads/{safe_name}"

    async def get_file_url(self, file_id: str) -> str:
        """
        Gets a signed URL for secure file download. Currently we just return a placeholder or we can look up DB.
        """
        return f"http://localhost:8000/static/uploads/{file_id}"

file_store = FileStoreManager()
