from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.area_service import AreaService
from app.schemas.area import AreaCreate, AreaInDB
from typing import List
import uuid

router = APIRouter()

@router.get("", response_model=List[AreaInDB])
async def list_areas(limit: int = 100, db: AsyncSession = Depends(get_db)):
    service = AreaService(db)
    areas = await service.list_areas(limit=limit)
    return areas

@router.get("/{id}", response_model=AreaInDB)
async def get_area(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    service = AreaService(db)
    area = await service.get_area(id)
    if not area:
        raise HTTPException(status_code=404, detail="Area not found or loaded")
    return area

@router.post("", response_model=AreaInDB)
async def create_area(obj_in: AreaCreate, db: AsyncSession = Depends(get_db)):
    service = AreaService(db)
    try:
        area = await service.create_area(obj_in)
        return area
    except Exception as e:
         raise HTTPException(status_code=400, detail=f"Creation failed: {str(e)}")
