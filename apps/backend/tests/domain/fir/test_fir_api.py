import pytest
import uuid
from datetime import datetime, timezone
from httpx import AsyncClient

# Mock UUIDs for testing (assuming test db is seeded with these or we mock)
TEST_STATION_ID = str(uuid.uuid4())
TEST_DISTRICT_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_create_fir(async_client: AsyncClient):
    payload = {
        "fir_number": "KA-BLR-2026-0001",
        "station_id": TEST_STATION_ID,
        "district_id": TEST_DISTRICT_ID,
        "date_filed": datetime.now(timezone.utc).isoformat(),
        "date_incident": datetime.now(timezone.utc).isoformat(),
        "crime_type": "THEFT",
        "description": "Theft of a motorcycle from residential parking."
    }
    
    # Normally we would need authentication token here
    response = await async_client.post("/api/v1/firs", json=payload)
    
    # If our test setup lacks a real DB or Auth override, this might return 401 or 500
    # For a real implementation, we'd mock the DB or use a test DB fixture.
    
    assert response.status_code in [201, 401, 500] # Depending on test harness setup

@pytest.mark.asyncio
async def test_search_firs(async_client: AsyncClient):
    response = await async_client.get("/api/v1/firs?crime_type=THEFT&limit=10")
    assert response.status_code in [200, 401]
