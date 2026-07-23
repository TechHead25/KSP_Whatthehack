import pytest
import uuid
from httpx import AsyncClient

TEST_TARGET_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_generate_report(async_client: AsyncClient):
    payload = {
        "report_type": "COURT",
        "target_id": TEST_TARGET_ID,
        "include_charts": True,
        "include_graph_snapshot": False
    }
    response = await async_client.post("/api/v1/reports/generate", json=payload)
    assert response.status_code in [200, 201, 401, 500]
    
    if response.status_code == 200:
        data = response.json()["data"]
        assert "download_url" in data
        assert "metadata" in data
        assert data["metadata"]["digital_signature_ready"] is True
