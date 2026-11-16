from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Conversation(Base):
    """
    this table holds the conversation details of users such as converssation_type, participants, last_message, title, description (if group conversation)
    """
    __tablename__ = "conversations"
    
    id: Mapped[int] =           mapped_column(Integer, primary_key=True, autoincrement=True)
    type: Mapped[str] =     mapped_column(String(10), nullable=False)      # IMP
    
    members: Mapped[str] = mapped_column(String(100), default="_")
    last_msg_id: Mapped[int] =           mapped_column(Integer, ForeignKey("messages.id"))
    