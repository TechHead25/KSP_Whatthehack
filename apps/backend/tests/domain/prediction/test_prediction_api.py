import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_predict_risk(async_client: AsyncClient):
    response = await async_client.get("/api/v1/prediction/suspect/test-123/risk")
    assert response.status_code in [200, 401]
    if response.status_code == 200:
        data = response.json()["data"]
        assert "risk_score" in data
        assert "confidence_score" in data
        assert "explanation" in data

@pytest.mark.asyncio
async def test_trigger_job(async_client: AsyncClient):
    response = await async_client.post("/api/v1/prediction/jobs/recalculate-risk")
    assert response.status_code in [200, 401]
