from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase): # define the Base
    pass

from app.models.users import User
from app.models.credentials import Credential
from app.models.sessions import Session

from app.models.profiles import Profile
from app.models.relations import Relation

from app.models.conversatons import Conversation
from backend.app.models.messages import Message