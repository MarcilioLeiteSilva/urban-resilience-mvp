import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, ForeignKey, Enum, String
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

    # Relacionamentos
    area_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("areas.id"), nullable=False)
    reporter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=True)

    # ORM Relations
    area = relationship("Area", back_populates="reports")
    reporter = relationship("User")
