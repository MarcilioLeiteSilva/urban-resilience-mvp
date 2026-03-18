import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, ForeignKey, Enum
from geoalchemy2 import Geometry
from app.models.base_model import Base
from app.models.enums import IncidentType, IncidentSeverity

class Incident(Base):
    __tablename__ = "incidents"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    type: Mapped[IncidentType] = mapped_column(Enum(IncidentType), nullable=False)
    severity: Mapped[IncidentSeverity] = mapped_column(Enum(IncidentSeverity), default=IncidentSeverity.MEDIUM)
    
    # PostGIS Point (Latitude, Longitude)
    point: Mapped[any] = mapped_column(Geometry("POINT", srid=4326), nullable=False)

    # Relacionamentos
    area_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("areas.id"), nullable=False)
    reporter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=True)

    # ORM Relations
    area = relationship("Area", back_populates="incidents")
    reporter = relationship("User")
