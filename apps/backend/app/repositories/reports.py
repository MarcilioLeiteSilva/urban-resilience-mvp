import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.report import CommunityReport
from app.models.area import Area
from uuid import UUID
from typing import List, Optional, Dict, Any

class ReportRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self, id: UUID) -> Optional[Dict[str, Any]]:
        stmt = select(CommunityReport, func.ST_AsGeoJSON(CommunityReport.point).label('geojson_point')).where(CommunityReport.id == id)
        result = await self.db.execute(stmt)
        row = result.fetchone()
        if not row:
            return None
        return self._to_dict(row.CommunityReport, row.geojson_point)

    async def list_all(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        stmt = select(CommunityReport, func.ST_AsGeoJSON(CommunityReport.point).label('geojson_point')).offset(offset).limit(limit)
        result = await self.db.execute(stmt)
        return [self._to_dict(row.CommunityReport, row.geojson_point) for row in result]

    async def create(self, db_obj: CommunityReport, geometry_dict: Dict[str, Any]) -> CommunityReport:
        # LÓGICA DE ASSOCIAÇÃO ESPACIAL AUTOMÁTICA
        # Verifica se o ponto está contido (ST_Contains) em alguma ÁREA existente
        point_geojson = json.dumps(geometry_dict)
        stmt = select(Area.id).where(func.ST_Contains(Area.geom, func.ST_GeomFromGeoJSON(point_geojson)))
        area_id = await self.db.scalar(stmt)
        
        if area_id:
            db_obj.area_id = area_id  # Vincula automaticamente!

        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update_status(self, id: UUID, status: str) -> Optional[CommunityReport]:
        stmt = select(CommunityReport).where(CommunityReport.id == id)
        result = await self.db.execute(stmt)
        db_obj = result.scalar_one_or_none()
        if db_obj:
            db_obj.status = status
            await self.db.commit()
            await self.db.refresh(db_obj)
        return db_obj

    @staticmethod
    def _to_dict(report: CommunityReport, geojson_str: Optional[str]) -> Dict[str, Any]:
        return {
            "id": report.id,
            "description": report.description,
            "status": report.status,
            "image_url": report.image_url,
            "ai_metadata": report.ai_metadata,
            "area_id": report.area_id,
            "reporter_id": report.reporter_id,
            "created_at": report.created_at,
            "updated_at": report.updated_at,
            "geometry": json.loads(geojson_str) if geojson_str else None
        }
