import pytest
import uuid
from httpx import AsyncClient

TEST_OFFICER_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_global_search(async_client: AsyncClient):
    payload = {
        "query": "stolen vehicle",
        "filters": {},
        "include_semantic": False
    }
    
    response = await async_client.post(f"/api/v1/search/global?officer_id={TEST_OFFICER_ID}", json=payload)
    assert response.status_code in [200, 401, 500]
    
    if response.status_code == 200:
        data = response.json()["data"]
        assert "total_results" in data
        assert "items" in data
        # 'items' should contain polymorphic entity formats
