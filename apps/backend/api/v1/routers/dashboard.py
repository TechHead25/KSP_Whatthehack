import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from infrastructure.database.catalyst import get_db
from core.responses import SuccessResponse
from domain.dashboard.schemas import OfficerDashboardResponse
from domain.dashboard.service import dashboard_orchestrator

router = APIRouter(prefix="/dashboard", tags=["Dashboard Aggregation (BFF)"])

@router.get("/officer/{officer_id}", response_model=SuccessResponse[OfficerDashboardResponse])
async def get_dashboard(officer_id: str, db: AsyncSession = Depends(get_db)):
    """
    Backend-For-Frontend (BFF) endpoint. Aggregates KPIs, AI Predictions, Alerts, 
    and Activity into a single optimized JSON payload for immediate UI consumption.
    """
    data = await dashboard_orchestrator.get_officer_dashboard(db, uuid.UUID(officer_id))
    return SuccessResponse(data=data)

@router.get("/widgets/heatmap", response_model=SuccessResponse[Dict[str, Any]])
async def get_heatmap_data():
    """
    Dedicated endpoint for lazy-loading heavy spatial heatmap coordinates.
    """
    # Mock return for architecture completeness
    return SuccessResponse(data={"type": "FeatureCollection", "features": []})

@router.get("/widgets/graph-summary", response_model=SuccessResponse[Dict[str, Any]])
async def get_graph_summary():
    """
    Dedicated endpoint for lazy-loading heavy Neo4j graph visualizations.
    """
    return SuccessResponse(data={"nodes": [], "links": []})
