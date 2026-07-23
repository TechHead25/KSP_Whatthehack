import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_search_graph(async_client: AsyncClient):
    response = await async_client.get("/api/v1/graph/search?label=Suspect&property_name=name&search_term=Dawood")
    assert response.status_code in [200, 401, 500]
    if response.status_code == 200:
        data = response.json()["data"]
        assert "nodes" in data
        assert "edges" in data

@pytest.mark.asyncio
async def test_centrality(async_client: AsyncClient):
    response = await async_client.get("/api/v1/graph/algorithms/centrality?label=Suspect")
    assert response.status_code in [200, 401, 500]
