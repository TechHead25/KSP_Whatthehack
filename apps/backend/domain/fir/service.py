import uuid
from typing import List, Optional
from datetime import datetime, timezone
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from ...core.exceptions import NETRABaseException, ValidationException
from .repository import fir_repo
from .schemas import FIRCreate, FIRUpdate, FIRFilterParams, FIRStatusUpdate, EvidenceCreate
from .models import FIR
from ..evidence.models import Evidence

log = structlog.get_logger()

class FIRNotFoundError(NETRABaseException):
    def __init__(self, fir_id: uuid.UUID):
        super().__init__(
            message=f"FIR with ID {fir_id} not found",
            code="FIR_NOT_FOUND",
            http_status=404,
        )

class FIRService:
    """Service layer for FIR business logic."""

    @staticmethod
    async def create_fir(db: AsyncSession, fir_in: FIRCreate) -> FIR:
        # Check if FIR number already exists
        existing = await fir_repo.get_by_fir_number(db, fir_in.fir_number)
        if existing:
            raise ValidationException(
                message=f"FIR number {fir_in.fir_number} already exists."
            )
        
        # Enforce business rule: Date filed cannot be before date incident
        if fir_in.date_filed < fir_in.date_incident:
            raise ValidationException(
                message="Date filed cannot be before date of incident."
            )

        fir = await fir_repo.create(db, obj_in=fir_in)
        log.info("fir_created", fir_id=str(fir.id), fir_number=fir.fir_number)
        return fir

    @staticmethod
    async def get_fir(db: AsyncSession, fir_id: uuid.UUID) -> FIR:
        fir = await fir_repo.get_with_details(db, fir_id)
        if not fir:
            raise FIRNotFoundError(fir_id)
        return fir

    @staticmethod
    async def search_firs(
        db: AsyncSession, filters: FIRFilterParams, skip: int = 0, limit: int = 20
    ) -> List[FIR]:
        return await fir_repo.search_firs(db, filters=filters, skip=skip, limit=limit)

    @staticmethod
    async def update_status(db: AsyncSession, fir_id: uuid.UUID, status_update: FIRStatusUpdate) -> FIR:
        fir = await fir_repo.get(db, fir_id)
        if not fir:
            raise FIRNotFoundError(fir_id)
            
        old_status = fir.status
        # In a real app, we'd create a timeline/audit record here for the status change
        # using status_update.reason
        
        updated_fir = await fir_repo.update(db, db_obj=fir, obj_in={"status": status_update.status})
        log.info("fir_status_updated", fir_id=str(fir.id), old_status=old_status, new_status=updated_fir.status)
        return updated_fir

    @staticmethod
    async def assign_officer(db: AsyncSession, fir_id: uuid.UUID, officer_id: uuid.UUID) -> FIR:
        fir = await fir_repo.get(db, fir_id)
        if not fir:
            raise FIRNotFoundError(fir_id)
            
        # Optional: Validate officer exists (would need officer_repo)
        
        updated_fir = await fir_repo.update(db, db_obj=fir, obj_in={"investigating_officer_id": officer_id})
        log.info("fir_officer_assigned", fir_id=str(fir.id), officer_id=str(officer_id))
        return updated_fir

    @staticmethod
    async def add_evidence(db: AsyncSession, fir_id: uuid.UUID, evidence_in: EvidenceCreate) -> Evidence:
        # Verify FIR exists
        fir = await fir_repo.get(db, fir_id)
        if not fir:
            raise FIRNotFoundError(fir_id)
            
        # Ensure fir_id matches the route param
        evidence_in_data = evidence_in.model_dump()
        evidence_in_data["fir_id"] = fir_id
        
        if not evidence_in.collected_at:
            evidence_in_data["collected_at"] = datetime.now(timezone.utc)
            
        # Convert back to dict/Pydantic equivalent if necessary. 
        # BaseRepository create expects a Pydantic model usually, so let's mock it
        # Actually repository accepts CreateSchemaType, we can pass a dict if we tweak the repo
        # or we just use the kwargs directly since we're interacting with SQLAlchemy.
        # It's better to pass it properly:
        
        db_obj = Evidence(**evidence_in_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        log.info("evidence_added", fir_id=str(fir_id), evidence_id=str(db_obj.id))
        return db_obj

    @staticmethod
    async def get_timeline(db: AsyncSession, fir_id: uuid.UUID) -> List[dict]:
        """
        Aggregate FIR creation, status updates, and evidence collection into a timeline.
        In a full implementation, we'd query an audit_logs or fir_events table.
        """
        fir = await FIRService.get_fir(db, fir_id)
        timeline = []
        
        timeline.append({
            "type": "INCIDENT",
            "date": fir.date_incident,
            "title": "Incident Occurred",
            "description": f"Crime incident logged as {fir.crime_type}"
        })
        
        timeline.append({
            "type": "FILED",
            "date": fir.date_filed,
            "title": "FIR Filed",
            "description": f"FIR {fir.fir_number} was officially registered"
        })
        
        # Add evidence to timeline
        for ev in fir.evidence:
            timeline.append({
                "type": "EVIDENCE_COLLECTED",
                "date": ev.collected_at or ev.created_at,
                "title": f"Evidence: {ev.title}",
                "description": ev.type
            })
            
        # Sort timeline by date descending
        timeline.sort(key=lambda x: x["date"], reverse=True)
        return timeline

fir_service = FIRService()
