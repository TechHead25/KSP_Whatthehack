import uuid
import hashlib
from typing import List, Optional
from datetime import datetime, timezone
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from ...core.exceptions import NETRABaseException
from .repository import evidence_repo
from .schemas import EvidenceCreate, ChainOfCustodyEntry, EvidenceAction, EvidenceType
from .models import Evidence
from ...infrastructure.storage.file_store import file_store

log = structlog.get_logger()

class EvidenceNotFoundError(NETRABaseException):
    def __init__(self, evidence_id: uuid.UUID):
        super().__init__(
            message=f"Evidence with ID {evidence_id} not found",
            code="EVIDENCE_NOT_FOUND",
            http_status=404,
        )

class EvidenceService:
    """Service layer for Evidence management."""

    @staticmethod
    async def process_and_upload(
        db: AsyncSession, 
        fir_id: uuid.UUID,
        officer_id: uuid.UUID,
        file_name: str, 
        file_data: bytes, 
        content_type: str,
        evidence_type: EvidenceType,
        description: Optional[str] = None
    ) -> Evidence:
        """
        Hashes the file, uploads to File Store, and creates the Evidence record
        with initial chain of custody.
        """
        # Generate SHA-256 hash for tamper-evidence verification
        sha256_hash = hashlib.sha256(file_data).hexdigest()
        size_bytes = len(file_data)
        
        log.info("hashing_evidence", file_name=file_name, hash=sha256_hash)
        
        # Upload to storage
        file_url = await file_store.upload_file(file_name, file_data, content_type)
        
        # Initial chain of custody entry
        initial_coc = ChainOfCustodyEntry(
            action=EvidenceAction.UPLOADED,
            officer_id=str(officer_id),
            timestamp=datetime.now(timezone.utc).isoformat(),
            hash_snapshot=sha256_hash
        )

        metadata = {
            "mime_type": content_type,
            "size_bytes": size_bytes,
            "sha256_hash": sha256_hash,
            "original_filename": file_name
        }

        # Create record
        evidence_in = EvidenceCreate(
            fir_id=fir_id,
            type=evidence_type,
            title=file_name,
            description=description,
            file_url=file_url,
            collected_by=officer_id,
            collected_at=datetime.now(timezone.utc),
            chain_of_custody=[initial_coc.model_dump()],
            metadata=metadata
        )
        
        evidence = await evidence_repo.create(db, obj_in=evidence_in)
        log.info("evidence_created", evidence_id=str(evidence.id), fir_id=str(fir_id))
        return evidence

    @staticmethod
    async def get_evidence(db: AsyncSession, evidence_id: uuid.UUID) -> Evidence:
        evidence = await evidence_repo.get(db, evidence_id)
        if not evidence:
            raise EvidenceNotFoundError(evidence_id)
        return evidence

    @staticmethod
    async def get_download_url(db: AsyncSession, evidence_id: uuid.UUID, officer_id: uuid.UUID) -> str:
        """
        Gets a signed URL and logs the download action in the chain of custody.
        """
        evidence = await EvidenceService.get_evidence(db, evidence_id)
        
        # Log action
        coc_entry = ChainOfCustodyEntry(
            action=EvidenceAction.DOWNLOADED,
            officer_id=str(officer_id),
            timestamp=datetime.now(timezone.utc).isoformat(),
            hash_snapshot=evidence.metadata_.get("sha256_hash") if evidence.metadata_ else None
        )
        await evidence_repo.append_chain_of_custody(db, evidence_id, coc_entry.model_dump())
        
        # Get secure URL (Catalyst File Store)
        # Note: In our file_store mock, it expects a file_id, we can just pass the DB id for now
        url = await file_store.get_file_url(str(evidence.id))
        return url

    @staticmethod
    async def verify_evidence(db: AsyncSession, evidence_id: uuid.UUID, officer_id: uuid.UUID) -> Evidence:
        """
        Marks evidence as verified by a senior officer and logs it.
        """
        evidence = await EvidenceService.get_evidence(db, evidence_id)
        
        # Log action
        coc_entry = ChainOfCustodyEntry(
            action=EvidenceAction.VERIFIED,
            officer_id=str(officer_id),
            timestamp=datetime.now(timezone.utc).isoformat(),
            hash_snapshot=evidence.metadata_.get("sha256_hash") if evidence.metadata_ else None
        )
        await evidence_repo.append_chain_of_custody(db, evidence_id, coc_entry.model_dump())
        
        evidence = await evidence_repo.update(db, db_obj=evidence, obj_in={"is_verified": True})
        return evidence

evidence_service = EvidenceService()
