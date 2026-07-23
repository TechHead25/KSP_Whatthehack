import structlog
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from .schemas import AnalyticsDashboardResponse, KPIData, TimeSeriesPoint, CategoryData, LocationData, OfficerPerformance
from .repository import analytics_repo

log = structlog.get_logger()

class AnalyticsService:
    """
    Business logic for Crime Analytics.
    Computes trends, severity thresholds, and bundles dashboards.
    """

    @staticmethod
    def _compute_severity(count: int) -> str:
        if count > 500: return "HIGH"
        if count > 100: return "MEDIUM"
        return "LOW"

    async def get_full_dashboard(self, db: AsyncSession) -> AnalyticsDashboardResponse:
        log.info("fetching_analytics_dashboard")
        
        # 1. KPIs
        total_firs = await analytics_repo.get_total_firs(db)
        active_cases = await analytics_repo.get_active_cases(db)
        high_risk_suspects = await analytics_repo.get_high_risk_suspects(db)
        
        # Mock trend calculations (In prod, requires querying previous month)
        kpis = [
            KPIData(label="Total FIRs", value=total_firs, trend="up", percentage_change=5.2),
            KPIData(label="Active Investigations", value=active_cases, trend="down", percentage_change=-2.1),
            KPIData(label="High Risk Suspects", value=high_risk_suspects, trend="neutral", percentage_change=0.0)
        ]
        
        # 2. Crime Trends
        trends_raw = await analytics_repo.get_crime_trends_monthly(db)
        trends = [TimeSeriesPoint(**r) for r in trends_raw]
        trends.reverse() # Sort chronologically for charting
        
        # 3. Category Distribution
        dist_raw = await analytics_repo.get_category_distribution(db)
        dist = [CategoryData(**r) for r in dist_raw]
        
        # 4. District Analysis
        district_raw = await analytics_repo.get_district_analysis(db)
        districts = [LocationData(**r, severity=self._compute_severity(r["count"])) for r in district_raw]
        
        # 5. Officer Performance
        officer_raw = await analytics_repo.get_top_officers(db)
        officers = [OfficerPerformance(**r) for r in officer_raw]
        
        return AnalyticsDashboardResponse(
            kpis=kpis,
            crime_trends=trends,
            category_distribution=dist,
            district_analysis=districts,
            officer_performance=officers
        )

analytics_service = AnalyticsService()
