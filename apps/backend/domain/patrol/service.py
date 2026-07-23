import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import CoverageAnalysis, PatrolScheduleCreate, PatrolScheduleResponse
from .repository import patrol_repo
from .engine import recommendation_engine

class PatrolService:
    """
    Business logic for Patrol assignments and Recommendations.
    """

    async def get_recommendations(self, db: AsyncSession, district_id: str) -> CoverageAnalysis:
        # 1. Fetch available officers in district
        available_officers = await patrol_repo.get_available_officers(db, uuid.UUID(district_id))
        
        # 2. Run engine to map officers to hotspots
        return recommendation_engine.generate_optimal_allocation(district_id, available_officers)
        
    async def schedule_patrol(self, db: AsyncSession, request: PatrolScheduleCreate) -> PatrolScheduleResponse:
        # Accepts a recommendation and commits it to DB
        schedule = await patrol_repo.create(db, request)
        return PatrolScheduleResponse.model_validate(schedule)

patrol_service = PatrolService()
