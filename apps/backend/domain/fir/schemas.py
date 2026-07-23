from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, UUID4

class FIRStatus(str, Enum):
    OPEN = "OPEN"
    INVESTIGATING = "INVESTIGATING"
    CHARGE_SHEETED = "CHARGE_SHEETED"
    CLOSED = "CLOSED"
    STAYED = "STAYED"

class FIRPriority(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class CrimeType(str, Enum):
    THEFT = "THEFT"
    ASSAULT = "ASSAULT"
    MURDER = "MURDER"
    CYBER = "CYBER"
    FRAUD = "FRAUD"
    NARCOTICS = "NARCOTICS"
    OTHER = "OTHER"

class EvidenceType(str, Enum):
    DOCUMENT = "DOCUMENT"
    PHOTO = "PHOTO"
    VIDEO = "VIDEO"
    FORENSIC = "FORENSIC"
    WITNESS = "WITNESS"

# --- Evidence Schemas ---

class EvidenceBase(BaseModel):
    type: EvidenceType
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    file_url: Optional[str] = None
    chain_of_custody: Optional[Dict[str, Any]] = None
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata")

class EvidenceCreate(EvidenceBase):
    collected_by: Optional[UUID4] = None
    collected_at: Optional[datetime] = None

class EvidenceResponse(EvidenceBase):
    id: UUID4
    fir_id: UUID4
    collected_by: Optional[UUID4]
    collected_at: Optional[datetime]
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

# --- FIR Schemas ---

class FIRBase(BaseModel):
    fir_number: str = Field(..., max_length=50)
    station_id: UUID4
    district_id: UUID4
    date_filed: datetime
    date_incident: datetime
    crime_type: CrimeType
    crime_subtype: Optional[str] = None
    ipc_sections: Optional[List[str]] = None
    status: FIRStatus = FIRStatus.OPEN
    priority: FIRPriority = FIRPriority.NORMAL
    description: str
    location_text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    victim_count: int = 0
    accused_count: int = 0
    property_value: Optional[float] = None

class FIRCreate(FIRBase):
    reporting_officer_id: Optional[UUID4] = None
    investigating_officer_id: Optional[UUID4] = None

class FIRUpdate(BaseModel):
    status: Optional[FIRStatus] = None
    priority: Optional[FIRPriority] = None
    investigating_officer_id: Optional[UUID4] = None
    description: Optional[str] = None
    risk_score: Optional[float] = None

class FIRStatusUpdate(BaseModel):
    status: FIRStatus
    reason: Optional[str] = None

class FIRResponse(FIRBase):
    id: UUID4
    reporting_officer_id: Optional[UUID4]
    investigating_officer_id: Optional[UUID4]
    summary_ai: Optional[str]
    risk_score: Optional[float]
    created_at: datetime
    updated_at: datetime
    
    # We may include evidence or suspect associations in a detailed view,
    # but for basic response we keep it flat.

    class Config:
        from_attributes = True

class FIRDetailResponse(FIRResponse):
    evidence: List[EvidenceResponse] = []
    # Add suspects list when suspect module is ready

# --- Search & Filters ---

class FIRFilterParams(BaseModel):
    station_id: Optional[UUID4] = None
    district_id: Optional[UUID4] = None
    crime_type: Optional[CrimeType] = None
    status: Optional[FIRStatus] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    keyword: Optional[str] = None
