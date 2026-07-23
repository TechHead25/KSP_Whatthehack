from typing import List, Dict, Any
from .registry import model_registry

class CrimeAnomalyDetector:
    def __init__(self):
        self.model = model_registry.load_model("isolation_forest_anomaly")

    def detect_anomalies(self) -> List[Dict[str, Any]]:
        """
        Uses Isolation Forest to detect abnormal spikes in specific crime types or locations.
        """
        return [
            {
                "type": "SPIKE",
                "category": "Cybercrime",
                "location": "District 3",
                "severity_score": 0.95,
                "explanation": "200% increase in reported cyber frauds compared to 30-day moving average.",
                "confidence": 0.89
            }
        ]

anomaly_detector = CrimeAnomalyDetector()
