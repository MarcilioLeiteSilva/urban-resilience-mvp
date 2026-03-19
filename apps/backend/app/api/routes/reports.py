from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.report_service import ReportService
from app.schemas.report import CommunityReportCreate, CommunityReportInDB, CommunityReportUpdate
from app.models.enums import ReportStatus
from typing import List
import uuid

router = APIRouter()

@router.get("", response_model=List[CommunityReportInDB])
async def list_reports(limit: int = 100, db: AsyncSession = Depends(get_db)):
    service = ReportService(db)
    reports = await service.list_reports(limit=limit)
    return reports

@router.get("/{id}", response_model=CommunityReportInDB)
async def get_report(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    service = ReportService(db)
    report = await service.get_report(id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

@router.post("", response_model=CommunityReportInDB)
async def create_report(obj_in: CommunityReportCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    service = ReportService(db)
    try:
        report = await service.create_report(obj_in)
        # Dispara análise de IA em background para nao travar o usuário
        background_tasks.add_task(service.process_report_with_ai, report["id"])
        return report
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Report creation failed: {str(e)}")

@router.patch("/{id}/status", response_model=CommunityReportInDB)
async def update_status(id: uuid.UUID, status: str, db: AsyncSession = Depends(get_db)):
    service = ReportService(db)
    # Valida status
    if status not in [s.value for s in ReportStatus]:
         raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {[s.value for s in ReportStatus]}")
         
    report = await service.update_status(id, status)
    if not report:
         raise HTTPException(status_code=404, detail="Report not found")
    return report
