import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Float, Text, String, ForeignKey, Enum
from geoalchemy2 import Geometry
from app.models.base_model import Base
from app.models.enums import InterventionStatus

class Intervention(Base):
    __tablename__ = "interventions"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[InterventionStatus] = mapped_column(Enum(InterventionStatus), default=InterventionStatus.PLANNED)
    
    cost_estimate: Mapped[float] = mapped_column(Float, default=0.0)

    # PostGIS Point (Latitude, Longitude) da obra
    point: Mapped[any] = mapped_column(Geometry("POINT", srid=4326), nullable=False)

    # Relacionamentos
    area_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("areas.id"), nullable=False)

    # ORM Relations
    area = relationship("Area", back_populates="interventions")
    
