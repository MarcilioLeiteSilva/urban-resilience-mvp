from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class AreaBase(BaseModel):
    name: str
    city: str
    description: Optional[str] = None

class AreaCreate(AreaBase):
    # Input esperado: Dicionário GeoJSON (Polygon ou MultiPolygon)
    geometry: Dict[str, Any]

class AreaUpdate(AreaBase):
    name: Optional[str] = None
    city: Optional[str] = None
    description: Optional[str] = None
    geometry: Optional[Dict[str, Any]] = None

class AreaInDB(AreaBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    # Saída como Dicionário GeoJSON para o Frontend
    geometry: Optional[Dict[str, Any]] = None

from app.schemas.incident import IncidentInDB
from app.schemas.intervention import InterventionInDB
from app.schemas.risk_score import RiskScoreInDB

class AreaDetailedInDB(AreaInDB):
    incidents: list[IncidentInDB] = []
    interventions: list[InterventionInDB] = []
    recent_risk_scores: list[RiskScoreInDB] = []
    reports_count: int = 0

    class Config:
        from_attributes = True
