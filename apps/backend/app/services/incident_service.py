import json
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.incidents import IncidentRepository
from app.schemas.incident import IncidentCreate
from app.models.incident import Incident
from app.models.enums import IncidentType, IncidentSeverity, ReportStatus
from typing import List, Optional, Dict, Any
from uuid import UUID

class IncidentService:
    def __init__(self, db: AsyncSession):
        self.repo = IncidentRepository(db)

    async def get_incident(self, id: UUID) -> Optional[Dict[str, Any]]:
        return await self.repo.get(id)

    async def list_incidents(self, limit: int = 100) -> List[Dict[str, Any]]:
        return await self.repo.list_all(limit=limit)

    async def create_incident(self, obj_in: IncidentCreate) -> Dict[str, Any]:
        db_obj = Incident(
            title=obj_in.title,
            description=obj_in.description,
            type=obj_in.type,
            severity=obj_in.severity,
            area_id=obj_in.area_id,
            report_id=obj_in.report_id,
            point=func.ST_GeomFromGeoJSON(json.dumps(obj_in.geometry))
        )
        await self.repo.create(db_obj)
        return await self.repo.get(db_obj.id)

    async def update_incident(self, id: UUID, obj_in: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_obj = await self.repo.update(id, obj_in)
        if db_obj:
            return await self.repo.get(id)
        return None

    # Lógica de Promoção de Report -> Incident
    async def promote_report_to_incident(self, report_id: UUID, title: str, type: IncidentType, severity: IncidentSeverity) -> Dict[str, Any]:
        from app.models.report import CommunityReport
        
        # 1. Busca Relief original
        stmt = select(CommunityReport).where(CommunityReport.id == report_id)
        result = await self.repo.db.execute(stmt)
        report = result.scalar_one_or_none()
        if not report:
             raise ValueError("Relato original nao encontrado.")
             
        if not report.area_id:
             raise ValueError("Relato nao possui area vinculada. Favor vincular manualmente antes da promocao.")

        # 2. Cria Incidente herdando ponto e Area
        db_obj = Incident(
             title=title,
             description=report.description,
             type=type,
             severity=severity,
             point=report.point, # Copia direto o pointwise geometry binary!
             area_id=report.area_id,
             report_id=report_id
        )
        
        # 3. Altera status do relato original para VALIDADO / FECHADO
        report.status = ReportStatus.VALIDATED
        
        # Salva
        await self.repo.create(db_obj)
        return await self.repo.get(db_obj.id)
