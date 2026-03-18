import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.intervention import Intervention
from uuid import UUID
from typing import List, Optional, Dict, Any

class InterventionRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: UUID) -> Optional[Dict[str, Any]]:
        stmt = select(Intervention, func.ST_AsGeoJSON(Intervention.point).label('geojson_point')).where(Intervention.id == id)
        result = await self.db.execute(stmt)
        row = result.fetchone()
        if not row:
            return None
        return self._to_dict(row.Intervention, row.geojson_point)

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        stmt = select(Intervention, func.ST_AsGeoJSON(Intervention.point).label('geojson_point')).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return [self._to_dict(row.Intervention, row.geojson_point) for row in result]

    async def create(self, db_obj: Intervention) -> Intervention:
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, id: UUID, obj_in: Dict[str, Any]) -> Optional[Intervention]:
        stmt = select(Intervention).where(Intervention.id == id)
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
    def _to_dict(intervention: Intervention, geojson_str: Optional[str]) -> Dict[str, Any]:
        return {
            "id": intervention.id,
            "title": intervention.title,
            "description": intervention.description,
            "status": intervention.status,
            "cost_estimate": intervention.cost_estimate,
            "responsible_agency": intervention.responsible_agency,
            "priority": intervention.priority,
            "started_at": intervention.started_at,
            "completed_at": intervention.completed_at,
            "area_id": intervention.area_id,
            "incident_id": intervention.incident_id,
            "created_at": intervention.created_at,
            "updated_at": intervention.updated_at,
            "geometry": json.loads(geojson_str) if geojson_str else None
        }
