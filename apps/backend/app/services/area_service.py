from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.areas import AreaRepository
from app.schemas.area import AreaCreate
from app.models.area import Area
from typing import List, Optional
from uuid import UUID

class AreaService:
    def __init__(self, db: AsyncSession):
        self.repo = AreaRepository(db)

    async def get_area(self, id: UUID) -> Optional[Area]:
        return await self.repo.get(id)

    async def list_areas(self, limit: int = 100, offset: int = 0) -> List[Area]:
        # Orchestrates listing calls and filters if needed
        return await self.repo.list_all(limit=limit, offset=offset)

    async def create_area(self, obj_in: AreaCreate) -> Area:
        # 1. Create area using repository access layer
        area = await self.repo.create(obj_in)
        
        # 2. Orchestration: Calculate scoring on separate service
        from app.services.risk_scoring_service import RiskScoringService
        risk_data = RiskScoringService.calculate_initial_risk(area, obj_in)
        
        # 3. Assign and update persistence fields
        area.risk_score = risk_data["score"]
        area.flood_risk_category = risk_data["level"]
        
        await self.repo.db.commit()
        await self.repo.db.refresh(area)
        
        return area
