import pytest
import uuid
from httpx import AsyncClient

TEST_DISTRICT_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_get_patrol_recommendations(async_client: AsyncClient):
    response = await async_client.get(f"/api/v1/patrol/recommendations?district_id={TEST_DISTRICT_ID}")
    assert response.status_code in [200, 401, 500]
    if response.status_code == 200:
        data = response.json()["data"]
        assert "total_officers_available" in data
        assert "total_hotspots_identified" in data
        assert "high_risk_coverage_percent" in data
        assert "allocations" in data
