import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Float, Text, String, ForeignKey, Enum, DateTime
from geoalchemy2 import Geometry
from app.models.base_model import Base
from app.models.enums import InterventionStatus

class Intervention(Base):
    __tablename__ = "interventions"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[InterventionStatus] = mapped_column(Enum(InterventionStatus), default=InterventionStatus.PLANNED)
    
    cost_estimate: Mapped[float] = mapped_column(Float, default=0.0)

    # Novos campos operacionais
    responsible_agency: Mapped[str | None] = mapped_column(String(100), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    
    started_at: Mapped[any | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[any | None] = mapped_column(DateTime, nullable=True)

    # PostGIS Point da obra
    point: Mapped[any] = mapped_column(Geometry("POINT", srid=4326), nullable=False)

    # Relacionamentos
    area_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("areas.id"), nullable=False)
    incident_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("incidents.id"), nullable=True)

    # ORM Relations
    area = relationship("Area", back_populates="interventions")
    incident = relationship("Incident")
    
