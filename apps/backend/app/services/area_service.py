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
