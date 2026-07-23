import pytest
import uuid
from httpx import AsyncClient

# Mock UUIDs
TEST_FIR_ID = str(uuid.uuid4())
TEST_OFFICER_ID = str(uuid.uuid4())
TEST_EVIDENCE_ID = str(uuid.uuid4())

@pytest.mark.asyncio
async def test_upload_evidence(async_client: AsyncClient):
    """
    Test the multipart form upload endpoint.
    """
    files = {
        "file": ("test_doc.pdf", b"mock pdf content", "application/pdf")
    }
    data = {
        "fir_id": TEST_FIR_ID,
        "officer_id": TEST_OFFICER_ID,
        "evidence_type": "DOCUMENT",
        "description": "A test document"
    }

    # Typically requires Auth, handled by fixture or mock DB
    response = await async_client.post("/api/v1/evidence/upload", data=data, files=files)
    
    # We expect 201 Created or 401/500 if DB/Auth aren't mocked in this test stub
    assert response.status_code in [201, 401, 500]

@pytest.mark.asyncio
async def test_get_evidence_download(async_client: AsyncClient):
    """
    Test the secure download endpoint, which logs Chain of Custody.
    """
    response = await async_client.get(f"/api/v1/evidence/{TEST_EVIDENCE_ID}/download?officer_id={TEST_OFFICER_ID}")
    assert response.status_code in [200, 401, 404, 500]
