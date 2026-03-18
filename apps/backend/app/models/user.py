from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Boolean, Enum
from app.models.base_model import Base
from app.models.enums import UserRole

class User(Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), 
        default=UserRole.COMMUNITY_MEMBER, 
        nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
