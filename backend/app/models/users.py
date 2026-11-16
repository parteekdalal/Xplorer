from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class User(Base):
    """
    the primary user table that holds the basic info of a user.
    """
    __tablename__ = "users"
    
    id: Mapped[int] =           mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] =     mapped_column(String(50), unique=True, nullable=False)      # IMP
    email: Mapped[str] =        mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(String(128), nullable=False)                      # IMP

    created_at: Mapped[int] = mapped_column(Integer, nullable=False)

