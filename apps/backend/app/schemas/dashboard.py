from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import List

class DashboardSummaryResponse(BaseModel):
    total_areas: int
    critical_areas: int
    recent_reports_count: int
    open_incidents_count: int
    ongoing_interventions_count: int

class CriticalAreaItem(BaseModel):
    id: UUID
    name: str
    city: str
    risk_score: float
    flood_risk_category: str

class RecentReportItem(BaseModel):
    id: UUID
    description: str
    status: str
    created_at: datetime
