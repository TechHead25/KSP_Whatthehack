from typing import Optional, List, Dict, Any
from datetime import date, datetime
from pydantic import BaseModel, Field, UUID4

# --- Sub-components ---

class SuspectAliasSchema(BaseModel):
    id: UUID4
    alias_name: str

    class Config:
        from_attributes = True

class SuspectPhoneSchema(BaseModel):
    id: UUID4
    phone_number: str
    provider: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class SuspectVehicleSchema(BaseModel):
    id: UUID4
    license_plate: str
    make_model: Optional[str] = None
    color: Optional[str] = None

    class Config:
        from_attributes = True

class SuspectAddressSchema(BaseModel):
    id: UUID4
    address_line: str
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    address_type: Optional[str] = None

    class Config:
        from_attributes = True

class AIInsights(BaseModel):
    ai_summary: Optional[str] = "No summary generated yet."
    crime_pattern: Optional[str] = "Insufficient data to determine pattern."
    behavior_analysis: Optional[str] = "No behavioral analysis available."
    prediction: Optional[str] = "No predictive trajectory available."
    recommendations: List[str] = []

class TimelineEvent(BaseModel):
    date: str
    title: str
    description: str
    type: str # 'ARREST', 'FIR_FILED', 'SIGHTING'

class KnownAssociate(BaseModel):
    suspect_id: str
    name: str
    relationship_strength: float # 0 to 1

# --- Master Digital Twin ---

class DigitalTwinProfile(BaseModel):
    # Core Identity
    id: UUID4
    first_name: str
    last_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    photograph_url: Optional[str] = None
    
    # Scores
    heat_score: float
    risk_score: float
    
    # Structured Relational Data
    aliases: List[SuspectAliasSchema] = []
    phones: List[SuspectPhoneSchema] = []
    vehicles: List[SuspectVehicleSchema] = []
    addresses: List[SuspectAddressSchema] = []
    
    # Dynamic AI / Graph Insights
    ai_insights: AIInsights = Field(default_factory=AIInsights)
    timeline: List[TimelineEvent] = []
    known_associates: List[KnownAssociate] = []
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Creation Schemas ---

class SuspectCreate(BaseModel):
    first_name: str
    last_name: str
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    photograph_url: Optional[str] = None

class SuspectUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    heat_score: Optional[float] = None
    risk_score: Optional[float] = None
    ai_profile_insights: Optional[Dict[str, Any]] = None
