from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ....infrastructure.database.catalyst import get_db
from ....core.responses import SuccessResponse
from ....domain.analytics.schemas import AnalyticsDashboardResponse
from ....domain.analytics.service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Crime Analytics"])

@router.get("/dashboard", response_model=SuccessResponse[AnalyticsDashboardResponse])
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Returns a composite payload of all core analytical charts and KPIs 
    designed for high-performance frontend dashboard rendering.
    """
    data = await analytics_service.get_full_dashboard(db)
    return SuccessResponse(data=data)
