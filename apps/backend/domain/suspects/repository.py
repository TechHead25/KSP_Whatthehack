import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ...core.repository import BaseRepository
from .models import Suspect
from .schemas import SuspectCreate, SuspectUpdate

class SuspectRepository(BaseRepository[Suspect, SuspectCreate, SuspectUpdate]):
    def __init__(self):
        super().__init__(Suspect)

    async def get_digital_twin_data(self, db: AsyncSession, suspect_id: uuid.UUID) -> Optional[Suspect]:
        """
        Eagerly loads all relational structured data attached to a suspect profile.
        """
        query = (
            select(self.model)
            .where(self.model.id == suspect_id)
            .options(
                selectinload(self.model.aliases),
                selectinload(self.model.phones),
                selectinload(self.model.vehicles),
                selectinload(self.model.addresses)
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()
        
    async def list_suspects_basic(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Suspect]:
        query = select(self.model).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

suspect_repo = SuspectRepository()
