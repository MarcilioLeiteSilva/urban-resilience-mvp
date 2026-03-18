import uuid
from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel
from app.models.enums import IncidentType, IncidentSeverity

class IncidentBase(BaseModel):
    title: str
    description: str | None = None
    type: IncidentType
    severity: IncidentSeverity = IncidentSeverity.MEDIUM
    area_id: uuid.UUID

# Entrada de dados em GeoJSON para pontos
class IncidentCreate(IncidentBase):
    geometry: Dict[str, Any]  # Ex: {"type": "Point", "coordinates": [-43.1234, -22.5678]}

class IncidentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    severity: IncidentSeverity | None = None
    status: str | None = None

class IncidentInDB(IncidentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    reporter_id: uuid.UUID | None = None
    
    # Saída do PostGIS convertida para dicionário GeoJSON
    geometry: Dict[str, Any] | None = None

    class Config:
        from_attributes = True
