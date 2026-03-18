from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.dashboard import DashboardRepository
from typing import List, Dict, Any

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.repo = DashboardRepository(db)

    async def get_summary(self) -> Dict[str, int]:
        return await self.repo.get_summary()

    async def list_critical_areas(self, limit: int = 5) -> List[Dict[str, Any]]:
        return await self.repo.get_critical_areas(limit=limit)

    async def list_recent_reports(self, limit: int = 5) -> List[Dict[str, Any]]:
        return await self.repo.get_recent_reports(limit=limit)
