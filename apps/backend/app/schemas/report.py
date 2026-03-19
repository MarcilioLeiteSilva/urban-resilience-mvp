import uuid
from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel
from app.models.enums import ReportStatus

class CommunityReportBase(BaseModel):
    description: str
    status: ReportStatus = ReportStatus.OPEN
    image_url: str | None = None
    area_id: uuid.UUID | None = None

# Entrada de dados GeoJSON Point
class CommunityReportCreate(CommunityReportBase):
    geometry: Dict[str, Any]  # Ex: {"type": "Point", "coordinates": [lng, lat]}

class CommunityReportUpdate(BaseModel):
    status: ReportStatus | None = None
    description: str | None = None

class CommunityReportInDB(CommunityReportBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    reporter_id: uuid.UUID | None = None
    
    # Saída do PostGIS convertida
    geometry: Dict[str, Any] | None = None

    class Config:
        from_attributes = True
