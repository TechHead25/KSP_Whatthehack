from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class OverviewWidgetData(BaseModel):
    total_active_firs: int
    predicted_crime_trend: str # 'UP', 'DOWN', 'STABLE'
    high_risk_suspects: int
    patrol_coverage_percent: float

class ActivityItem(BaseModel):
    timestamp: str
    action: str
    entity_type: str
    entity_id: str
    description: str

class AlertWidget(BaseModel):
    unread_critical_alerts: int
    recent_alerts: List[Dict[str, Any]]

class DashboardWidgets(BaseModel):
    overview: OverviewWidgetData
    recent_activity: List[ActivityItem]
    alerts: AlertWidget
    heatmap_url: str # Endpoint to lazy load heavy spatial data
    graph_summary_url: str # Endpoint to lazy load heavy graph data

class OfficerDashboardResponse(BaseModel):
    officer_id: str
    officer_name: str
    widgets: DashboardWidgets
    last_refreshed: str
