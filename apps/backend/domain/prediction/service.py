import structlog
import uuid
from typing import Dict, Any

from .schemas import RiskScoreResponse, HotspotResponse, HotspotPoint, AnomalyResponse, Anomaly, ForecastResponse, ForecastPoint
from ...infrastructure.ml.risk_scorer import risk_scorer
from ...infrastructure.ml.hotspot import hotspot_predictor
from ...infrastructure.ml.anomaly import anomaly_detector
from ...infrastructure.ml.forecaster import trend_forecaster

log = structlog.get_logger()

class PredictionService:
    """
    Orchestrates ML Inference, caching, and formats responses with Explainability.
    """

    async def get_suspect_risk(self, suspect_id: str) -> RiskScoreResponse:
        log.info("running_inference", model="xgboost_risk", suspect_id=suspect_id)
        # Mock feature retrieval
        features = {"prior_arrests": 3, "has_known_associates": True, "age": 22}
        
        score, confidence, shap = risk_scorer.predict(features)
        
        return RiskScoreResponse(
            suspect_id=suspect_id,
            risk_score=score,
            confidence_score=confidence,
            explanation=shap
        )

    async def get_hotspots(self, district_id: str) -> HotspotResponse:
        log.info("running_inference", model="spatial_kde", district_id=district_id)
        raw_spots = hotspot_predictor.predict_hotspots(district_id)
        spots = [HotspotPoint(**s) for s in raw_spots]
        return HotspotResponse(district_id=district_id, hotspots=spots)

    async def get_anomalies(self) -> AnomalyResponse:
        log.info("running_inference", model="isolation_forest")
        raw_anom = anomaly_detector.detect_anomalies()
        anomalies = [Anomaly(**a) for a in raw_anom]
        return AnomalyResponse(anomalies=anomalies)

    async def get_forecast(self) -> ForecastResponse:
        # In a real app, we would cache this heavily using aioredis
        # as forecasting is computationally expensive.
        log.info("running_inference", model="prophet")
        raw_forecast = trend_forecaster.forecast_30_days()
        points = [ForecastPoint(**f) for f in raw_forecast]
        return ForecastResponse(trend=points)

prediction_service = PredictionService()
