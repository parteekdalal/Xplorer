from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Profile(Base):
    """
    this table store the profile data of a user that can be shared publicly.
    """
    __tablename__ = "profiles"
    
    user_id: Mapped[int] =        mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    username: Mapped[str] =       mapped_column(String(50), ForeignKey("users.username"), nullable=False)
    
    display_name: Mapped[str] =   mapped_column(String(50), default="")
    bio: Mapped[str] =            mapped_column(String(255), default="no bio")

    birth_year: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String, nullable=False)
    
    # interests: Mapped[str] = mapped_column(String(100), default="_")
    # languages: Mapped[str] = mapped_column(String(100), default="_")