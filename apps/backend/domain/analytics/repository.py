import structlog
from typing import List, Dict, Any
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..fir.models import FIR
from ..shared.models import Officer, District
from ..suspects.models import Suspect

log = structlog.get_logger()

class AnalyticsRepository:
    """
    Executes raw SQLAlchemy Core aggregations for analytical charting endpoints.
    Bypasses ORM instantiation for max performance.
    """
    
    @staticmethod
    async def get_total_firs(db: AsyncSession) -> int:
        query = select(func.count(FIR.id))
        result = await db.execute(query)
        return result.scalar() or 0

    @staticmethod
    async def get_active_cases(db: AsyncSession) -> int:
        query = select(func.count(FIR.id)).where(FIR.status == 'OPEN')
        result = await db.execute(query)
        return result.scalar() or 0

    @staticmethod
    async def get_high_risk_suspects(db: AsyncSession) -> int:
        query = select(func.count(Suspect.id)).where(Suspect.risk_score >= 80.0)
        result = await db.execute(query)
        return result.scalar() or 0

    @staticmethod
    async def get_crime_trends_monthly(db: AsyncSession, limit: int = 12) -> List[Dict[str, Any]]:
        is_sqlite = db.bind.dialect.name == "sqlite" if db.bind else True
        if is_sqlite:
            month_expr = func.strftime('%Y-%m', FIR.created_at)
        else:
            month_expr = func.date_trunc('month', FIR.created_at)
            
        query = (
            select(
                month_expr.label('month'),
                func.count(FIR.id).label('count')
            )
            .group_by(month_expr)
            .order_by(desc('month'))
            .limit(limit)
        )
        result = await db.execute(query)
        # Parse into standard dicts
        return [{"timestamp": str(r.month) if r.month else "", "count": r.count} for r in result.fetchall()]

    @staticmethod
    async def get_category_distribution(db: AsyncSession) -> List[Dict[str, Any]]:
        query = (
            select(FIR.crime_type, func.count(FIR.id).label('count'))
            .group_by(FIR.crime_type)
            .order_by(desc('count'))
        )
        result = await db.execute(query)
        return [{"category": r.crime_type or "Unknown", "count": r.count} for r in result.fetchall()]

    @staticmethod
    async def get_district_analysis(db: AsyncSession) -> List[Dict[str, Any]]:
        query = (
            select(District.name.label("district_name"), func.count(FIR.id).label('count'))
            .join(FIR, District.id == FIR.district_id)
            .group_by(District.name)
            .order_by(desc('count'))
        )
        result = await db.execute(query)
        return [{"district": r.district_name or "Unknown", "count": r.count} for r in result.fetchall()]

    @staticmethod
    async def get_top_officers(db: AsyncSession, limit: int = 5) -> List[Dict[str, Any]]:
        # Simplified query counting FIRs assigned to officer.
        query = (
            select(
                Officer.id, 
                Officer.name, 
                func.count(FIR.id).label('total_cases')
            )
            .outerjoin(FIR, Officer.id == FIR.investigating_officer_id)
            .group_by(Officer.id, Officer.name)
            .order_by(desc('total_cases'))
            .limit(limit)
        )
        result = await db.execute(query)
        return [
            {
                "officer_id": str(r.id),
                "name": str(r.name).strip(),
                "cases_resolved": int(r.total_cases * 0.7), # Mock logic for resolved vs active
                "active_cases": int(r.total_cases * 0.3),
                "efficiency_score": 85.5 # Mock logic
            }
            for r in result.fetchall()
        ]

analytics_repo = AnalyticsRepository()
