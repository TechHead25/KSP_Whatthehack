import uuid
from typing import List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.repository import BaseRepository
from .models import PatrolSchedule
from .schemas import PatrolScheduleCreate, PatrolScheduleUpdate
from domain.shared.models import Officer

class PatrolRepository(BaseRepository[PatrolSchedule, PatrolScheduleCreate, PatrolScheduleUpdate]):
    def __init__(self):
        super().__init__(PatrolSchedule)

    async def get_available_officers(self, db: AsyncSession, district_id: uuid.UUID) -> List[Officer]:
        """
        Fetches officers currently available for patrol assignment in a given district.
        """
        query = select(Officer).where(Officer.district_id == district_id)
        # In a real system, we'd filter by shift times, current assignments, and leave status.
        result = await db.execute(query)
        return list(result.scalars().all())
        
patrol_repo = PatrolRepository()
