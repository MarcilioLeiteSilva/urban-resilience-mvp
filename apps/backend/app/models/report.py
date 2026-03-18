import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, ForeignKey, Enum, String, JSON
from geoalchemy2 import Geometry
from app.models.base_model import Base
from app.models.enums import ReportStatus

class CommunityReport(Base):
    __tablename__ = "community_reports"

    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), default=ReportStatus.OPEN)
    
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # PostGIS Point (Latitude, Longitude) do relato
    point: Mapped[any] = mapped_column(Geometry("POINT", srid=4326), nullable=False)

    # Campos para futura IA (Metadata JSON)
    ai_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True, default={})

    # Relacionamentos
    # Nullable para permitir que o pino caia fora de qualquer Area cadastrada
    area_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("areas.id"), nullable=True)
    reporter_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    # ORM Relations
    area = relationship("Area", back_populates="reports")
    reporter = relationship("User")
