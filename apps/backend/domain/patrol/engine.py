import uuid
from typing import List

from .schemas import CoverageAnalysis, OfficerAllocation, RecommendedRoute, Waypoint
from ..shared.models import Officer
from ...infrastructure.ml.hotspot import hotspot_predictor

class RecommendationEngine:
    """
    Combines spatial ML hotspots with operational constraints (Officer availability)
    to generate optimized patrol schedules.
    """

    def generate_optimal_allocation(self, district_id: str, available_officers: List[Officer]) -> CoverageAnalysis:
        # 1. Fetch ML Hotspots
        hotspots = hotspot_predictor.predict_hotspots(district_id)
        
        allocations = []
        covered_hotspots = 0
        total_hotspots = len(hotspots)
        
        # 2. Greedy allocation heuristic
        # If we have 2 officers and 5 hotspots, we divide hotspots among officers.
        # For simplicity in this implementation, we just assign hotspots sequentially to available officers.
        
        for i, officer in enumerate(available_officers):
            if i < len(hotspots):
                h = hotspots[i]
                wp = Waypoint(
                    lat=h["lat"],
                    lng=h["lng"],
                    priority_score=h["intensity"],
                    reason=f"Predicted {h['predicted_crime_type']} hotspot"
                )
                
                route = RecommendedRoute(
                    route_id=str(uuid.uuid4()),
                    estimated_duration_mins=45,
                    waypoints=[wp]
                )
                
                allocations.append(OfficerAllocation(
                    officer_id=officer.id,
                    name=f"{officer.first_name} {officer.last_name}",
                    recommended_route=route
                ))
                covered_hotspots += 1
                
        # 3. Calculate coverage metrics
        coverage_percent = (covered_hotspots / total_hotspots * 100) if total_hotspots > 0 else 100.0
        
        return CoverageAnalysis(
            total_officers_available=len(available_officers),
            total_hotspots_identified=total_hotspots,
            high_risk_coverage_percent=coverage_percent,
            allocations=allocations
        )

recommendation_engine = RecommendationEngine()
