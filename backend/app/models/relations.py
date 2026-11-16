from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Relation(Base):
    """
    this table store the relations (friends) of users.
    """
    __tablename__ = "relations"
    
    user_id: Mapped[int] =        mapped_column(Integer, ForeignKey("users.id"))
    relative_id: Mapped[int] =        mapped_column(Integer, ForeignKey("users.id"))
    status: Mapped[str] =       mapped_column(String(50))
