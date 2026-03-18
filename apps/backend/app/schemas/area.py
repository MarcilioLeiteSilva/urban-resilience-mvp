from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class AreaBase(BaseModel):
    name: str
    description: Optional[str] = None
    risk_score: Optional[float] = 0.0

class AreaCreate(AreaBase):
    # Geometry input as WKT or GeoJSON coordinates list representation
    # We will use WKT or list for simplifies creation.
    # WKT representation: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))'
    geom_wkt: str

class AreaUpdate(AreaBase):
    name: Optional[str] = None
    geom_wkt: Optional[str] = None

class AreaInDB(AreaBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    flood_risk_category: Optional[str] = "LOW"

    # We return WKT or GeoJSON in actual implementation, represented here abstractly
    geom_wkt: Optional[str] = None

    class Config:
        from_attributes = True
