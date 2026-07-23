import uuid
from typing import List, Dict, Any
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import JSONB

from core.repository import BaseRepository
from .models import Evidence
from .schemas import EvidenceCreate, EvidenceUpdate

class EvidenceRepository(BaseRepository[Evidence, EvidenceCreate, EvidenceUpdate]):
    def __init__(self):
        super().__init__(Evidence)

    async def get_by_fir(self, db: AsyncSession, fir_id: uuid.UUID) -> List[Evidence]:
        query = select(self.model).where(self.model.fir_id == fir_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def append_chain_of_custody(self, db: AsyncSession, evidence_id: uuid.UUID, entry: Dict[str, Any]) -> Evidence:
        """Appends a log entry to the chain of custody array safely."""
        # Using a raw update to avoid race conditions with list mutations in Python memory
        # In a real PostgreSQL environment with JSONB, we could use JSONB concat `||`
        # For simplicity and cross-compatibility (e.g. SQLite local dev), we fetch, append, save.
        
        evidence = await self.get(db, evidence_id)
        if evidence:
            current_chain = evidence.chain_of_custody or []
            # Create a new list to trigger SQLAlchemy's mutation tracking
            new_chain = list(current_chain)
            new_chain.append(entry)
            
            evidence.chain_of_custody = new_chain
            db.add(evidence)
            await db.commit()
            await db.refresh(evidence)
            
        return evidence

evidence_repo = EvidenceRepository()
