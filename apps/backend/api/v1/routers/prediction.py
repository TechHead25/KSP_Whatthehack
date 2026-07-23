from fastapi import APIRouter, BackgroundTasks, Query
from typing import Dict, Any

from ....core.responses import SuccessResponse
from ....domain.prediction.schemas import RiskScoreResponse, HotspotResponse, AnomalyResponse, ForecastResponse
from ....domain.prediction.service import prediction_service
from ....domain.prediction.jobs import recalculate_all_risk_scores

router = APIRouter(prefix="/prediction", tags=["AI Prediction & ML"])

@router.get("/suspect/{suspect_id}/risk", response_model=SuccessResponse[RiskScoreResponse])
async def get_suspect_risk(suspect_id: str):
    """Calculates risk score for a suspect using XGBoost with SHAP explainability."""
    data = await prediction_service.get_suspect_risk(suspect_id)
    return SuccessResponse(data=data)

@router.get("/hotspots", response_model=SuccessResponse[HotspotResponse])
async def get_hotspots(district_id: str = Query(..., description="District ID for spatial bounds")):
    """Predicts future crime hotspots using Spatial KDE."""
    data = await prediction_service.get_hotspots(district_id)
    return SuccessResponse(data=data)

@router.get("/anomalies", response_model=SuccessResponse[AnomalyResponse])
async def get_anomalies():
    """Detects active crime anomalies using Isolation Forest."""
    data = await prediction_service.get_anomalies()
    return SuccessResponse(data=data)

@router.get("/trends", response_model=SuccessResponse[ForecastResponse])
async def get_trends():
    """Fetches a 30-day time-series forecast using Facebook Prophet."""
    data = await prediction_service.get_forecast()
    return SuccessResponse(data=data)

@router.post("/jobs/recalculate-risk", response_model=SuccessResponse[Dict[str, Any]])
async def trigger_risk_recalculation(background_tasks: BackgroundTasks):
    """Triggers an async background job to recalculate all risk scores in the DB."""
    background_tasks.add_task(recalculate_all_risk_scores)
    return SuccessResponse(message="Batch risk recalculation job added to queue.")
