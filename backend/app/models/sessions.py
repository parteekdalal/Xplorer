from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Session(Base):
    """
    the session information table. stores the session informations
    """
    __tablename__ = "sessions"

    id: Mapped[int] =           mapped_column(InterruptedError, primary_key=True, autoincrement=True)

    user_id: Mapped[int] =      mapped_column(Integer, ForeignKey("users.id"))
    token_hash: Mapped[str] =   mapped_column(String(128), nullable=False)                     # IMP
    expires_at: Mapped[int] =   mapped_column(Integer, nullable=False)                         # IMP
    device: Mapped[str] =       mapped_column(String(128), nullable=False)                     # IMP

    