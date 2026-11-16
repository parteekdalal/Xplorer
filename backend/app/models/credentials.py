from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Credential(Base):
    """
    the `credentials` table holds credentials obviously...
    """
    __tablename__ = "credentials"
    
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True)
    hashed_password: Mapped[str] = mapped_column(String(128), nullable=False)