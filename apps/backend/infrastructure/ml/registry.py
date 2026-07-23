import structlog
from typing import Dict, Any

log = structlog.get_logger()

class ModelRegistry:
    """
    Singleton for loading and caching Machine Learning models in memory.
    Simulates a production MLflow/SageMaker model registry.
    """
    _instance = None
    _models: Dict[str, Any] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
        return cls._instance

    def load_model(self, model_name: str, version: str = "latest") -> Any:
        key = f"{model_name}_{version}"
        if key not in self._models:
            log.info(f"Loading ML model into memory: {key}")
            # Mock loading of .pkl or .onnx models
            self._models[key] = f"<MockedModelInstance: {model_name} v{version}>"
        return self._models[key]

model_registry = ModelRegistry()
