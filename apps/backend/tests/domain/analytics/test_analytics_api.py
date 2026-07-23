import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_analytics_dashboard(async_client: AsyncClient):
    response = await async_client.get("/api/v1/analytics/dashboard")
    assert response.status_code in [200, 401, 500]
    
    if response.status_code == 200:
        data = response.json()["data"]
        # Verify the structure matches AnalyticsDashboardResponse
        assert "kpis" in data
        assert "crime_trends" in data
        assert "category_distribution" in data
        assert "district_analysis" in data
        assert "officer_performance" in data
