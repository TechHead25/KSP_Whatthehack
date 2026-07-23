import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, Query, status

from sqlalchemy.ext.asyncio import AsyncSession
from infrastructure.database.catalyst import get_db
from core.responses import SuccessResponse
from domain.fir.schemas import (
    FIRCreate, FIRUpdate, FIRResponse, FIRDetailResponse, 
    FIRFilterParams, FIRStatusUpdate, EvidenceCreate, EvidenceResponse
)
from domain.fir.service import fir_service

router = APIRouter(prefix="/firs", tags=["FIR Management"])

@router.post("", response_model=SuccessResponse[FIRResponse], status_code=status.HTTP_201_CREATED)
async def create_fir(
    fir_in: FIRCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new First Information Report (FIR)."""
    fir = await fir_service.create_fir(db, fir_in=fir_in)
    # Using from_attributes implicitly via Pydantic inside the route response wrapper
    return SuccessResponse(
        data=FIRResponse.model_validate(fir),
        message="FIR created successfully"
    )

@router.get("", response_model=SuccessResponse[List[FIRResponse]])
async def list_firs(
    station_id: uuid.UUID = None,
    district_id: uuid.UUID = None,
    crime_type: str = None,
    status: str = None,
    keyword: str = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Search and filter FIRs."""
    filters = FIRFilterParams(
        station_id=station_id,
        district_id=district_id,
        crime_type=crime_type,
        status=status,
        keyword=keyword
    )
    firs = await fir_service.search_firs(db, filters=filters, skip=skip, limit=limit)
    return SuccessResponse(
        data=[FIRResponse.model_validate(f) for f in firs]
    )

@router.get("/{fir_id}", response_model=SuccessResponse[FIRDetailResponse])
async def get_fir(
    fir_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed view of a specific FIR including evidence."""
    fir = await fir_service.get_fir(db, fir_id=fir_id)
    return SuccessResponse(
        data=FIRDetailResponse.model_validate(fir)
    )

@router.patch("/{fir_id}/status", response_model=SuccessResponse[FIRResponse])
async def update_fir_status(
    fir_id: uuid.UUID,
    status_update: FIRStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update the status of an FIR (e.g. OPEN to INVESTIGATING)."""
    fir = await fir_service.update_status(db, fir_id=fir_id, status_update=status_update)
    return SuccessResponse(
        data=FIRResponse.model_validate(fir),
        message="FIR status updated"
    )

@router.post("/{fir_id}/assign", response_model=SuccessResponse[FIRResponse])
async def assign_officer(
    fir_id: uuid.UUID,
    officer_id: uuid.UUID = Query(..., description="ID of the officer to assign"),
    db: AsyncSession = Depends(get_db)
):
    """Assign an Investigating Officer to an FIR."""
    fir = await fir_service.assign_officer(db, fir_id=fir_id, officer_id=officer_id)
    return SuccessResponse(
        data=FIRResponse.model_validate(fir),
        message="Officer assigned successfully"
    )

@router.post("/{fir_id}/evidence", response_model=SuccessResponse[EvidenceResponse], status_code=status.HTTP_201_CREATED)
async def add_evidence(
    fir_id: uuid.UUID,
    evidence_in: EvidenceCreate,
    db: AsyncSession = Depends(get_db)
):
    """Attach evidence to an FIR."""
    evidence = await fir_service.add_evidence(db, fir_id=fir_id, evidence_in=evidence_in)
    return SuccessResponse(
        data=EvidenceResponse.model_validate(evidence),
        message="Evidence added successfully"
    )

@router.get("/{fir_id}/timeline", response_model=SuccessResponse[List[dict]])
async def get_fir_timeline(
    fir_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get the chronological timeline of events for an FIR."""
    timeline = await fir_service.get_timeline(db, fir_id=fir_id)
    return SuccessResponse(
        data=timeline
    )
