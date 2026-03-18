import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.models.enums import InterventionStatus

from datetime import datetime

class InterventionBase(BaseModel):
    title: str
    description: str | None = None
    status: InterventionStatus = InterventionStatus.PLANNED
    cost_estimate: float = 0.0
    area_id: uuid.UUID
    
    # Novos campos operacionais
    responsible_agency: Optional[str] = None
    priority: str = "MEDIUM"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    incident_id: Optional[uuid.UUID] = None

# Entrada de dados GeoJSON Point
class InterventionCreate(InterventionBase):
    geometry: Dict[str, Any]  # Ex: {"type": "Point", "coordinates": [lng, lat]}

class InterventionUpdate(BaseModel):
    status: InterventionStatus | None = None
    description: str | None = None
    cost_estimate: float | None = None

class InterventionInDB(InterventionBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    # Saída do PostGIS convertida
    geometry: Dict[str, Any] | None = None

    class Config:
        from_attributes = True
