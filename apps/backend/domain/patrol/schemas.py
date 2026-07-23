from typing import List, Optional
from pydantic import BaseModel, UUID4
from datetime import datetime

class Waypoint(BaseModel):
    lat: float
    lng: float
    priority_score: float
    reason: str # E.g., 'Predicted Hotspot', 'Recent Crime', 'Routine'

class RecommendedRoute(BaseModel):
    route_id: str
    estimated_duration_mins: int
    waypoints: List[Waypoint]

class OfficerAllocation(BaseModel):
    officer_id: UUID4
    name: str
    recommended_route: RecommendedRoute

class CoverageAnalysis(BaseModel):
    total_officers_available: int
    total_hotspots_identified: int
    high_risk_coverage_percent: float # 0 to 100
    allocations: List[OfficerAllocation]

class PatrolScheduleCreate(BaseModel):
    officer_id: UUID4
    district_id: UUID4
    start_time: datetime
    end_time: datetime
    route_waypoints: List[Waypoint]

class PatrolScheduleUpdate(BaseModel):
    status: str

class PatrolScheduleResponse(PatrolScheduleCreate):
    id: UUID4
    status: str
    
    class Config:
        from_attributes = True
