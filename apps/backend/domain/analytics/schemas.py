from typing import List, Optional
from pydantic import BaseModel

class KPIData(BaseModel):
    label: str
    value: int
    trend: str # 'up', 'down', 'neutral'
    percentage_change: float

class TimeSeriesPoint(BaseModel):
    timestamp: str # ISO date string
    count: int

class CategoryData(BaseModel):
    category: str
    count: int

class LocationData(BaseModel):
    district: str
    count: int
    severity: str # 'HIGH', 'MEDIUM', 'LOW'

class OfficerPerformance(BaseModel):
    officer_id: str
    name: str
    cases_resolved: int
    active_cases: int
    efficiency_score: float # 0 to 100

class AnalyticsDashboardResponse(BaseModel):
    kpis: List[KPIData]
    crime_trends: List[TimeSeriesPoint]
    category_distribution: List[CategoryData]
    district_analysis: List[LocationData]
    officer_performance: List[OfficerPerformance]
