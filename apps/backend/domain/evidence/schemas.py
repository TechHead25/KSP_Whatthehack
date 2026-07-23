from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, UUID4

class EvidenceType(str, Enum):
    DOCUMENT = "DOCUMENT"
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"
    FORENSIC = "FORENSIC"
    WITNESS = "WITNESS"

class EvidenceAction(str, Enum):
    UPLOADED = "UPLOADED"
    VIEWED = "VIEWED"
    DOWNLOADED = "DOWNLOADED"
    VERIFIED = "VERIFIED"
    MODIFIED = "MODIFIED"

class ChainOfCustodyEntry(BaseModel):
    action: EvidenceAction
    officer_id: str
    timestamp: str
    hash_snapshot: Optional[str] = None
    ip_address: Optional[str] = None

class EvidenceMetadata(BaseModel):
    mime_type: Optional[str] = None
    size_bytes: Optional[int] = None
    sha256_hash: Optional[str] = None
    original_filename: Optional[str] = None

# --- Schemas ---

class EvidenceBase(BaseModel):
    fir_id: UUID4
    type: EvidenceType
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    file_url: Optional[str] = None

class EvidenceCreate(EvidenceBase):
    collected_by: Optional[UUID4] = None
    collected_at: Optional[datetime] = None
    chain_of_custody: List[Dict[str, Any]] = []
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata")

class EvidenceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_verified: Optional[bool] = None

class EvidenceResponse(EvidenceBase):
    id: UUID4
    collected_by: Optional[UUID4]
    collected_at: Optional[datetime]
    is_verified: bool
    chain_of_custody: List[Dict[str, Any]]
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
