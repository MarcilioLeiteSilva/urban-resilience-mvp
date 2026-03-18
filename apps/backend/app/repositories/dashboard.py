import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.area import Area
from app.models.report import CommunityReport
from app.models.incident import Incident
from app.models.intervention import Intervention
from app.models.enums import InterventionStatus
from uuid import UUID
from typing import List, Optional, Dict, Any

class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_summary(self) -> Dict[str, int]:
        total_areas = await self.db.scalar(select(func.count(Area.id))) or 0
        critical_areas = await self.db.scalar(select(func.count(Area.id)).where(func.lower(Area.flood_risk_category) == 'high')) or 0
        recent_reports = await self.db.scalar(select(func.count(CommunityReport.id))) or 0
        open_incidents = await self.db.scalar(select(func.count(Incident.id))) or 0
        
        from app.models.enums import InterventionStatus
        ongoing_interventions = await self.db.scalar(
            select(func.count(Intervention.id)).where(Intervention.status == InterventionStatus.IN_PROGRESS)
        ) or 0

        return {
            "total_areas": total_areas,
            "critical_areas": critical_areas,
            "recent_reports_count": recent_reports,
            "open_incidents_count": open_incidents,
            "ongoing_interventions_count": ongoing_interventions
        }

    async def get_critical_areas(self, limit: int = 5) -> List[Dict[str, Any]]:
        # Áreas ordenadas pelo maior score de risco
        stmt = select(Area).where(func.lower(Area.flood_risk_category) == 'high').order_by(Area.risk_score.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return [{
            "id": a.id,
            "name": a.name,
            "city": a.city,
            "risk_score": a.risk_score or 0.0,
            "flood_risk_category": a.flood_risk_category
        } for a in result.scalars().all()]

    async def get_recent_reports(self, limit: int = 5) -> List[Dict[str, Any]]:
        stmt = select(CommunityReport).order_by(CommunityReport.created_at.desc()).limit(limit)
        result = await self.db.execute(stmt)
        return [{
            "id": r.id,
            "description": r.description,
            "status": r.status.value if hasattr(r.status, 'value') else r.status,
            "created_at": r.created_at
        } for r in result.scalars().all()]
