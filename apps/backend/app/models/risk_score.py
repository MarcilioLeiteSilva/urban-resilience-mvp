import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Float, String, ForeignKey, Text
from app.models.base_model import Base

class RiskScore(Base):
    __tablename__ = "risk_scores"

    score: Mapped[float] = mapped_column(Float, default=0.0)
    category: Mapped[str] = mapped_column(String(20), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    
    description_details: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relacionamentos
    area_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("areas.id"), nullable=False)

    # ORM Relations
    area = relationship("Area", back_populates="risk_history")
