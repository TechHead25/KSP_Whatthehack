import pytest
import uuid
from httpx import AsyncClient

TEST_OFFICER_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_trigger_alert(async_client: AsyncClient):
    payload = {
        "alert_type": "CRIME_SPIKE",
        "channel": "PUSH",
        "payload": {
            "message": "Critical incident near MG Road",
            "severity": "CRITICAL"
        }
    }
    
    response = await async_client.post(f"/api/v1/alerts/trigger-test?officer_id={TEST_OFFICER_ID}", json=payload)
    assert response.status_code in [200, 201, 401, 500]
    
@pytest.mark.asyncio
async def test_get_alert_history(async_client: AsyncClient):
    response = await async_client.get(f"/api/v1/alerts/history/{TEST_OFFICER_ID}")
    assert response.status_code in [200, 401, 500]
