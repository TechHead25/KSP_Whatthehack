import uuid
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.catalyst import get_db
from core.responses import SuccessResponse
from domain.patrol.schemas import CoverageAnalysis, PatrolScheduleCreate, PatrolScheduleResponse
from domain.patrol.service import patrol_service

router = APIRouter(prefix="/patrol", tags=["Patrol & Recommendation"])

@router.get("/recommendations", response_model=SuccessResponse[CoverageAnalysis])
async def get_patrol_recommendations(
    district_id: str = Query(..., description="District ID to generate routes for"),
    db: AsyncSession = Depends(get_db)
):
    """
    Dynamically generates optimal patrol routes by mapping spatial ML Hotspots 
    to available Officer resources.
    """
    data = await patrol_service.get_recommendations(db, district_id)
    return SuccessResponse(data=data)

@router.post("/schedule", response_model=SuccessResponse[PatrolScheduleResponse])
async def schedule_patrol_route(
    request: PatrolScheduleCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Locks in a recommended route and assigns it to an officer's shift.
    """
    data = await patrol_service.schedule_patrol(db, request)
    return SuccessResponse(data=data, message="Patrol route successfully scheduled.")
