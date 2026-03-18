import json
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.interventions import InterventionRepository
from app.schemas.intervention import InterventionCreate
from app.models.intervention import Intervention
from typing import List, Optional, Dict, Any
from uuid import UUID

class InterventionService:
    def __init__(self, db: AsyncSession):
        self.repo = InterventionRepository(db)

    async def get_intervention(self, id: UUID) -> Optional[Dict[str, Any]]:
        return await self.repo.get(id)

    async def list_interventions(self, limit: int = 100) -> List[Dict[str, Any]]:
        return await self.repo.list_all(limit=limit)

    async def create_intervention(self, obj_in: InterventionCreate) -> Dict[str, Any]:
        db_obj = Intervention(
            title=obj_in.title,
            description=obj_in.description,
            status=obj_in.status,
            cost_estimate=obj_in.cost_estimate,
            responsible_agency=obj_in.responsible_agency,
            priority=obj_in.priority,
            started_at=obj_in.started_at,
            completed_at=obj_in.completed_at,
            area_id=obj_in.area_id,
            incident_id=obj_in.incident_id,
            point=func.ST_GeomFromGeoJSON(json.dumps(obj_in.geometry))
        )
        await self.repo.create(db_obj)
        return await self.repo.get(db_obj.id)

    async def update_intervention(self, id: UUID, obj_in: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        db_obj = await self.repo.update(id, obj_in)
        if db_obj:
            return await self.repo.get(id)
        return None
