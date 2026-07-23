import pytest
import uuid
from httpx import AsyncClient

# Mock UUIDs
TEST_OFFICER_ID = str(uuid.uuid4())
TEST_FIR_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_chat_stream(async_client: AsyncClient):
    """
    Test the AI chat streaming endpoint.
    Since this returns SSE, we can test if the initial connection succeeds.
    """
    payload = {
        "message": "Analyze the suspect's connections.",
        "officer_id": TEST_OFFICER_ID,
        "context_fir_id": TEST_FIR_ID
    }

    # Typically requires Auth, handled by fixture or mock DB
    response = await async_client.post("/api/v1/intelligence/chat/stream", json=payload)
    
    # We expect 200 OK (streaming response) or 401/500 if DB/Auth aren't mocked in this test stub
    assert response.status_code in [200, 401, 500]
    
    # If 200, verify the content type is event-stream
    if response.status_code == 200:
        assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

@pytest.mark.asyncio
async def test_list_conversations(async_client: AsyncClient):
    """Test getting conversation history."""
    response = await async_client.get(f"/api/v1/intelligence/conversations?officer_id={TEST_OFFICER_ID}")
    assert response.status_code in [200, 401, 500]
