from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] =           mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] =     mapped_column(String(50), unique=True, nullable=False)      # IMP
    email: Mapped[str] =        mapped_column(String(100), nullable=False)                  # IMP
    password: Mapped[str] = mapped_column(String(128), nullable=False)                      # IMP

    display_name: Mapped[str] = mapped_column(String(50), default="")
    bio: Mapped[str] =  mapped_column(String(255), default="no bio")
    birth_year: Mapped[int] = mapped_column(Integer, nullable=False)                        # IMP
    gender: Mapped[str] = mapped_column(String, nullable=False)                             # IMP
    
    interests: Mapped[str] = mapped_column(String(100), default="_")
    languages: Mapped[str] = mapped_column(String(100), default="_")