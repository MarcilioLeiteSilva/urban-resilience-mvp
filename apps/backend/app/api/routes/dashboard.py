from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardSummaryResponse, CriticalAreaItem, RecentReportItem
from typing import List

router = APIRouter()

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_summary(db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    return await service.get_summary()

@router.get("/critical-areas", response_model=List[CriticalAreaItem])
async def list_critical_areas(limit: int = 5, db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    return await service.list_critical_areas(limit=limit)

@router.get("/recent-reports", response_model=List[RecentReportItem])
async def list_recent_reports(limit: int = 5, db: AsyncSession = Depends(get_db)):
    service = DashboardService(db)
    return await service.list_recent_reports(limit=limit)
