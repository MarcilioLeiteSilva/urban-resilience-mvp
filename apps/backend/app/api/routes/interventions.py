from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.intervention_service import InterventionService
from app.schemas.intervention import InterventionCreate, InterventionInDB, InterventionUpdate
from typing import List
import uuid

router = APIRouter()

@router.get("", response_model=List[InterventionInDB])
async def list_interventions(limit: int = 100, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    interventions = await service.list_interventions(limit=limit)
    return interventions

@router.post("", response_model=InterventionInDB)
async def create_intervention(obj_in: InterventionCreate, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    try:
        intervention = await service.create_intervention(obj_in)
        return intervention
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Intervention creation failed: {str(e)}")

@router.patch("/{id}", response_model=InterventionInDB)
async def update_intervention(id: uuid.UUID, obj_in: InterventionUpdate, db: AsyncSession = Depends(get_db)):
    service = InterventionService(db)
    intervention = await service.update_intervention(id, obj_in.dict(exclude_unset=True))
    if not intervention:
         raise HTTPException(status_code=404, detail="Intervention not found")
    return intervention
