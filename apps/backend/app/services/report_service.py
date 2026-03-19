import json
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.reports import ReportRepository
from app.schemas.report import CommunityReportCreate
from app.models.report import CommunityReport
from typing import List, Optional, Dict, Any
from uuid import UUID

class ReportService:
    def __init__(self, db: AsyncSession):
        self.repo = ReportRepository(db)

    async def get_report(self, id: UUID) -> Optional[Dict[str, Any]]:
        return await self.repo.get(id)

    async def list_reports(self, limit: int = 100) -> List[Dict[str, Any]]:
        return await self.repo.list_all(limit=limit)

    async def create_report(self, obj_in: CommunityReportCreate) -> Dict[str, Any]:
        # Converte para Model
        db_obj = CommunityReport(
            description=obj_in.description,
            image_url=obj_in.image_url,
            # Point PostGIS do input GeoJSON
            point=func.ST_GeomFromGeoJSON(json.dumps(obj_in.geometry)),
            ai_metadata={} # pronto para classificação posterior
        )
        
        # O repositório faz a associação espacial da Area automática!
        await self.repo.create(db_obj, obj_in.geometry)
        
        # Recarrega formatado via repositório
        return await self.repo.get(db_obj.id)

    async def update_status(self, id: UUID, status: str) -> Optional[Dict[str, Any]]:
        db_obj = await self.repo.update_status(id, status)
        if db_obj:
            return await self.repo.get(id)
        return None

    async def process_report_with_ai(self, report_id: UUID):
        from app.services.ai.factory import get_ai_service
        from app.models.report import CommunityReport
        from sqlalchemy import select

        stmt = select(CommunityReport).where(CommunityReport.id == report_id)
        result = await self.repo.db.execute(stmt)
        report = result.scalar_one_or_none()
        if not report:
            return

        try:
            ai = get_ai_service()
            analysis = await ai.analyze_report(report.description)
            report.ai_metadata = analysis
            await self.repo.db.commit()
        except Exception as e:
            print(f"AI Error: {e}")
