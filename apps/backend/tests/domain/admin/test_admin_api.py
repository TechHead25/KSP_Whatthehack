import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_telemetry(async_client: AsyncClient):
    response = await async_client.get("/api/v1/admin/monitoring/telemetry")
    assert response.status_code in [200, 401]
    
    if response.status_code == 200:
        data = response.json()["data"]
        assert "database_metrics" in data
        assert "recent_errors" in data
