from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ExplainabilityFeature(BaseModel):
    feature_name: str
    weight: float

class RiskScoreResponse(BaseModel):
    suspect_id: str
    risk_score: float
    confidence_score: float
    explanation: Dict[str, float]

class HotspotPoint(BaseModel):
    lat: float
    lng: float
    intensity: float
    confidence: float
    predicted_crime_type: str

class HotspotResponse(BaseModel):
    district_id: str
    hotspots: List[HotspotPoint]

class Anomaly(BaseModel):
    type: str
    category: str
    location: str
    severity_score: float
    explanation: str
    confidence: float

class AnomalyResponse(BaseModel):
    anomalies: List[Anomaly]

class ForecastPoint(BaseModel):
    date: str
    predicted_count: int
    lower_bound: int
    upper_bound: int

class ForecastResponse(BaseModel):
    trend: List[ForecastPoint]
