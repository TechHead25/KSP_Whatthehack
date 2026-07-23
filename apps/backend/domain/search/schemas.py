from enum import Enum
from pydantic import BaseModel, UUID4
from typing import List, Dict, Any, Optional

class EntityType(str, Enum):
    FIR = "FIR"
    OFFICER = "OFFICER"
    EVIDENCE = "EVIDENCE"
    VEHICLE = "VEHICLE"
    PHONE = "PHONE"
    LOCATION = "LOCATION"
    SUSPECT = "SUSPECT"

class SearchResultItem(BaseModel):
    entity_type: EntityType
    entity_id: str
    title: str
    subtitle: Optional[str] = None
    match_score: float = 1.0
    metadata: Dict[str, Any] = {}

class GlobalSearchRequest(BaseModel):
    query: str
    filters: Dict[str, Any] = {}
    include_semantic: bool = False
    limit: int = 20
    offset: int = 0

class GlobalSearchResponse(BaseModel):
    total_results: int
    execution_time_ms: int
    items: List[SearchResultItem]

class AutocompleteResponse(BaseModel):
    suggestions: List[str]
