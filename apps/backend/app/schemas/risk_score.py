import uuid
from datetime import datetime
from pydantic import BaseModel

class RiskScoreBase(BaseModel):
    score: float = 0.0
    category: str = "LOW"
    area_id: uuid.UUID
    description_details: str | None = None

class RiskScoreCreate(RiskScoreBase):
    pass

class RiskScoreInDB(RiskScoreBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
