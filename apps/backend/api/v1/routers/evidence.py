import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, status

from sqlalchemy.ext.asyncio import AsyncSession
from ....infrastructure.database.catalyst import get_db
from ....core.responses import SuccessResponse
from ....domain.evidence.schemas import EvidenceResponse, EvidenceType
from ....domain.evidence.service import evidence_service

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.post("/upload", response_model=SuccessResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
async def upload_evidence(
    fir_id: uuid.UUID = Form(...),
    officer_id: uuid.UUID = Form(...),
    evidence_type: EvidenceType = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload evidence for an FIR. 
    Accepts multipart/form-data. Generates SHA-256 hash for chain of custody.
    """
    file_data = await file.read()
    evidence = await evidence_service.process_and_upload(
        db=db,
        fir_id=fir_id,
        officer_id=officer_id,
        file_name=file.filename,
        file_data=file_data,
        content_type=file.content_type,
        evidence_type=evidence_type,
        description=description
    )
    
    return SuccessResponse(
        data=EvidenceResponse.model_validate(evidence),
        message="Evidence uploaded and hashed successfully"
    )

@router.get("/{evidence_id}", response_model=SuccessResponse[EvidenceResponse])
async def get_evidence_details(
    evidence_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get metadata and chain of custody for a specific piece of evidence."""
    evidence = await evidence_service.get_evidence(db, evidence_id=evidence_id)
    return SuccessResponse(
        data=EvidenceResponse.model_validate(evidence)
    )

@router.get("/{evidence_id}/download", response_model=SuccessResponse[dict])
async def get_evidence_download_url(
    evidence_id: uuid.UUID,
    officer_id: uuid.UUID, # In reality, extracted from JWT middleware
    db: AsyncSession = Depends(get_db)
):
    """
    Get a secure download URL. Logs this access in the Chain of Custody.
    """
    url = await evidence_service.get_download_url(db, evidence_id=evidence_id, officer_id=officer_id)
    return SuccessResponse(
        data={"download_url": url},
        message="Download URL generated. Access logged."
    )

@router.patch("/{evidence_id}/verify", response_model=SuccessResponse[EvidenceResponse])
async def verify_evidence(
    evidence_id: uuid.UUID,
    officer_id: uuid.UUID, # In reality, extracted from JWT middleware
    db: AsyncSession = Depends(get_db)
):
    """Verify evidence integrity. Logs this action in the Chain of Custody."""
    evidence = await evidence_service.verify_evidence(db, evidence_id=evidence_id, officer_id=officer_id)
    return SuccessResponse(
        data=EvidenceResponse.model_validate(evidence),
        message="Evidence verified and logged."
    )
