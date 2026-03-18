import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.incident import Incident
from uuid import UUID
from typing import List, Optional, Dict, Any

class IncidentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: UUID) -> Optional[Dict[str, Any]]:
        stmt = select(Incident, func.ST_AsGeoJSON(Incident.point).label('geojson_point')).where(Incident.id == id)
        result = await self.db.execute(stmt)
        row = result.fetchone()
        if not row:
            return None
        return self._to_dict(row.Incident, row.geojson_point)

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        stmt = select(Incident, func.ST_AsGeoJSON(Incident.point).label('geojson_point')).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return [self._to_dict(row.Incident, row.geojson_point) for row in result]

    async def create(self, db_obj: Incident) -> Incident:
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, id: UUID, obj_in: Dict[str, Any]) -> Optional[Incident]:
        stmt = select(Incident).where(Incident.id == id)
        result = await self.db.execute(stmt)
        db_obj = result.scalar_one_or_none()
        if db_obj:
            for field, value in obj_in.items():
                if hasattr(db_obj, field) and value is not None:
                    setattr(db_obj, field, value)
            await self.db.commit()
            await self.db.refresh(db_obj)
        return db_obj

    @staticmethod
    def _to_dict(incident: Incident, geojson_str: Optional[str]) -> Dict[str, Any]:
        return {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "type": incident.type,
            "severity": incident.severity,
            "area_id": incident.area_id,
            "report_id": incident.report_id,
            "reporter_id": incident.reporter_id,
            "created_at": incident.created_at,
            "updated_at": incident.updated_at,
            "geometry": json.loads(geojson_str) if geojson_str else None
        }
