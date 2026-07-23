import uuid
from typing import List, Optional

from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.repository import BaseRepository
from .models import FIR
from .schemas import FIRCreate, FIRUpdate, FIRFilterParams


class FIRRepository(BaseRepository[FIR, FIRCreate, FIRUpdate]):
    def __init__(self):
        super().__init__(FIR)

    async def get_with_details(self, db: AsyncSession, fir_id: uuid.UUID) -> Optional[FIR]:
        """Fetch an FIR with its related evidence and suspects."""
        query = (
            select(self.model)
            .where(self.model.id == fir_id)
            .options(
                selectinload(self.model.evidence),
                selectinload(self.model.suspects)
            )
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_fir_number(self, db: AsyncSession, fir_number: str) -> Optional[FIR]:
        query = select(self.model).where(self.model.fir_number == fir_number)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def search_firs(
        self, db: AsyncSession, filters: FIRFilterParams, skip: int = 0, limit: int = 20
    ) -> List[FIR]:
        """Search FIRs with various filters."""
        query = select(self.model)
        conditions = []

        if filters.station_id:
            conditions.append(self.model.station_id == filters.station_id)
        if filters.district_id:
            conditions.append(self.model.district_id == filters.district_id)
        if filters.crime_type:
            conditions.append(self.model.crime_type == filters.crime_type)
        if filters.status:
            conditions.append(self.model.status == filters.status)
        if filters.date_from:
            conditions.append(self.model.date_incident >= filters.date_from)
        if filters.date_to:
            conditions.append(self.model.date_incident <= filters.date_to)
        if filters.keyword:
            # ILIKE search for description or fir_number
            keyword_cond = or_(
                self.model.description.ilike(f"%{filters.keyword}%"),
                self.model.fir_number.ilike(f"%{filters.keyword}%")
            )
            conditions.append(keyword_cond)

        if conditions:
            query = query.where(and_(*conditions))
            
        # Default order by incident date descending
        query = query.order_by(self.model.date_incident.desc()).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return list(result.scalars().all())


# Initialize instance for injection
fir_repo = FIRRepository()
