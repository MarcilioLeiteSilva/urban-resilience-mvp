from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.incident_service import IncidentService
from app.schemas.incident import IncidentCreate, IncidentInDB, IncidentUpdate
from app.models.enums import IncidentType, IncidentSeverity
from typing import List
from pydantic import BaseModel
import uuid

router = APIRouter()

class PromotionRequest(BaseModel):
    title: str
    type: IncidentType
    severity: IncidentSeverity = IncidentSeverity.MEDIUM

@router.get("", response_model=List[IncidentInDB])
async def list_incidents(limit: int = 100, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    incidents = await service.list_incidents(limit=limit)
    return incidents

@router.get("/{id}", response_model=IncidentInDB)
async def get_incident(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    incident = await service.get_incident(id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("", response_model=IncidentInDB)
async def create_incident(obj_in: IncidentCreate, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    try:
        incident = await service.create_incident(obj_in)
        return incident
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Incident creation failed: {str(e)}")

@router.patch("/{id}", response_model=IncidentInDB)
async def update_incident(id: uuid.UUID, obj_in: IncidentUpdate, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    incident = await service.update_incident(id, obj_in.dict(exclude_unset=True))
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

# ROTA DE PROMOÇÃO DE RELATO -> INCIDENTE
@router.post("/from-report/{report_id}", response_model=IncidentInDB)
async def promote_from_report(report_id: uuid.UUID, req: PromotionRequest, db: AsyncSession = Depends(get_db)):
    service = IncidentService(db)
    try:
        incident = await service.promote_report_to_incident(
             report_id=report_id,
             title=req.title,
             type=req.type,
             severity=req.severity
        )
        return incident
    except ValueError as e:
         raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Erro na promocao: {str(e)}")
