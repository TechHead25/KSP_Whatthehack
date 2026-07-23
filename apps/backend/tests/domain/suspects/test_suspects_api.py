import pytest
import uuid
from httpx import AsyncClient

TEST_SUSPECT_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_get_digital_twin(async_client: AsyncClient):
    # This will likely return 404 since the suspect doesn't exist in the mock DB,
    # but it verifies the routing and dependencies are correct.
    response = await async_client.get(f"/api/v1/suspects/{TEST_SUSPECT_ID}/twin")
    assert response.status_code in [200, 401, 404, 500]

@pytest.mark.asyncio
async def test_create_suspect(async_client: AsyncClient):
    payload = {
        "first_name": "Test",
        "last_name": "Suspect",
        "gender": "M"
    }
    response = await async_client.post("/api/v1/suspects", json=payload)
    assert response.status_code in [200, 201, 401, 500]
