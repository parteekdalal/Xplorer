from sqlalchemy import String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models import Base

class Message(Base):
    """
    this table holds the conversation details of users such as converssation_type, participants, last_message, title, description (if group conversation)
    """
    __tablename__ = "messages"
    
    id: Mapped[int] =           mapped_column(Integer, primary_key=True, autoincrement=True)
    conversation_id: Mapped[int] =           mapped_column(Integer, ForeignKey("conversations.id"))
    sender_id: Mapped[int] =           mapped_column(Integer, ForeignKey("users.id"))
    
    sent_at: Mapped[str] =     mapped_column(String(10), nullable=False)

    text: Mapped[str] = mapped_column(String(2048), nullable=False)
    # attachment_id: Mapped[int] = mapped_column(Integer, ForeignKey("media.id"))