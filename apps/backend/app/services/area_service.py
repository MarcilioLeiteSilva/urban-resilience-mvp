import json
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.areas import AreaRepository
from app.schemas.area import AreaCreate
from app.models.area import Area
from typing import List, Optional, Dict, Any
from uuid import UUID

class AreaService:
    def __init__(self, db: AsyncSession):
        self.repo = AreaRepository(db)

    async def get_area(self, id: UUID) -> Optional[Dict[str, Any]]:
        return await self.repo.get(id)

    async def get_area_detailed(self, id: UUID) -> Optional[Dict[str, Any]]:
        area_dict = await self.repo.get(id)
        if not area_dict:
            return None

        db = self.repo.db
        from app.models.incident import Incident
        from app.models.intervention import Intervention
        from app.models.risk_score import RiskScore
        from app.models.report import CommunityReport
        from sqlalchemy import select

        # 1. Incidentes recentes
        incident_stmt = select(Incident, func.ST_AsGeoJSON(Incident.point).label('geojson_point')).where(Incident.area_id == id).order_by(Incident.created_at.desc()).limit(5)
        incidents_result = await db.execute(incident_stmt)
        incidents = []
        for row in incidents_result:
            incidents.append({
                "id": row.Incident.id,
                "title": row.Incident.title,
                "description": row.Incident.description,
                "type": row.Incident.type,
                "severity": row.Incident.severity,
                "area_id": row.Incident.area_id,
                "created_at": row.Incident.created_at,
                "updated_at": row.Incident.updated_at,
                "geometry": json.loads(row.geojson_point) if row.geojson_point else None
            })

        # 2. Intervenções em andamento
        from app.models.enums import InterventionStatus
        interv_stmt = select(Intervention, func.ST_AsGeoJSON(Intervention.point).label('geojson_point')).where(Intervention.area_id == id, Intervention.status == InterventionStatus.IN_PROGRESS).limit(5)
        intervs_result = await db.execute(interv_stmt)
        interventions = []
        for row in intervs_result:
               interventions.append({
                    "id": row.Intervention.id,
                    "title": row.Intervention.title,
                    "description": row.Intervention.description,
                    "status": row.Intervention.status,
                    "cost_estimate": row.Intervention.cost_estimate,
                    "area_id": row.Intervention.area_id,
                    "created_at": row.Intervention.created_at,
                    "updated_at": row.Intervention.updated_at,
                    "geometry": json.loads(row.geojson_point) if row.geojson_point else None
               })

        # 3. Score de risco mais recente
        risk_stmt = select(RiskScore).where(RiskScore.area_id == id).order_by(RiskScore.created_at.desc()).limit(3)
        recent_scores = [{
             "id": r.id, "score": r.score, "category": r.category, "area_id": r.area_id, "created_at": r.created_at
        } for r in (await db.scalars(risk_stmt)).all()]

        # 4. Contagem de relatos recentes (últimos 7 dias)
        from datetime import timedelta, datetime
        since = datetime.now() - timedelta(days=7)
        reports_stmt = select(func.count(CommunityReport.id)).where(CommunityReport.area_id == id, CommunityReport.created_at >= since)
        reports_count = await db.scalar(reports_stmt) or 0

        # Mesclar
        area_dict["incidents"] = incidents
        area_dict["interventions"] = interventions
        area_dict["recent_risk_scores"] = recent_scores
        area_dict["reports_count"] = reports_count

        return area_dict

    async def list_areas(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        return await self.repo.list_all(limit=limit, offset=offset)

    async def create_area(self, obj_in: AreaCreate) -> Dict[str, Any]:
        # Orchestration layer creates the ORM model from the GeoJSON dict
        db_obj = Area(
            name=obj_in.name,
            city=obj_in.city,
            description=obj_in.description,
            geom=func.ST_GeomFromGeoJSON(json.dumps(obj_in.geometry))
        )
        await self.repo.create(db_obj)
        
        # Risk scoring using recalculated vertices metrics on GeoJSON dict
        from app.services.risk_scoring_service import RiskScoringService
        risk_data = RiskScoringService.calculate_initial_risk(db_obj, obj_in)
        db_obj.risk_score = risk_data["score"]
        db_obj.flood_risk_category = risk_data["level"]
        
        # Save updates
        await self.repo.db.commit()
        await self.repo.db.refresh(db_obj)
        
        # Reload fully built structured dictionary output via repository
        return await self.repo.get(db_obj.id)
