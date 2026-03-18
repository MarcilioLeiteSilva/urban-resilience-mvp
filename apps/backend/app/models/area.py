from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float
from geoalchemy2 import Geometry
from app.models.base_model import Base

class Area(Base):
    __tablename__ = "areas"

    name: Mapped[str] = mapped_column(String(100), index=True)
    city: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    
    # PostGIS Geometry field (Polygon, SRID 4326 - WGS84)
    geom: Mapped[any] = mapped_column(Geometry("POLYGON", srid=4326), nullable=False)

    # Risk Score Details (0.0 to 1.0 or similar)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    flood_risk_category: Mapped[str | None] = mapped_column(String(20), nullable=True, default="LOW")

    # ORM Relations
    incidents = relationship("Incident", back_populates="area", cascade="all, delete-orphan")
    reports = relationship("CommunityReport", back_populates="area", cascade="all, delete-orphan")
    interventions = relationship("Intervention", back_populates="area", cascade="all, delete-orphan")
    risk_history = relationship("RiskScore", back_populates="area", cascade="all, delete-orphan")
