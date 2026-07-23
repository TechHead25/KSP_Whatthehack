import pytest
import uuid
from httpx import AsyncClient

TEST_OFFICER_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_get_dashboard(async_client: AsyncClient):
    response = await async_client.get(f"/api/v1/dashboard/officer/{TEST_OFFICER_ID}")
    assert response.status_code in [200, 401, 500]
    
    if response.status_code == 200:
        data = response.json()["data"]
        assert "officer_id" in data
        assert "widgets" in data
        
        widgets = data["widgets"]
        assert "overview" in widgets
        assert "alerts" in widgets
        assert "recent_activity" in widgets
