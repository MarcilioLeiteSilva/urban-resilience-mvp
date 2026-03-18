import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.area import Area
from uuid import UUID
from typing import List, Optional, Dict, Any

class AreaRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: UUID) -> Optional[Dict[str, Any]]:
        # Busca a entidade convertendo a geometria para GeoJSON String
        stmt = select(Area, func.ST_AsGeoJSON(Area.geom).label('geojson_geom')).where(Area.id == id)
        result = await self.db.execute(stmt)
        row = result.fetchone()
        if not row:
            return None
        return self._to_dict(row.Area, row.geojson_geom)

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        stmt = select(Area, func.ST_AsGeoJSON(Area.geom).label('geojson_geom')).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return [self._to_dict(row.Area, row.geojson_geom) for row in result]

    async def create(self, db_obj: Area) -> Area:
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    @staticmethod
    def _to_dict(area: Area, geojson_str: Optional[str]) -> Dict[str, Any]:
        return {
            "id": area.id,
            "name": area.name,
            "city": area.city,
            "description": area.description,
            "created_at": area.created_at,
            "updated_at": area.updated_at,
            "geometry": json.loads(geojson_str) if geojson_str else None
        }
