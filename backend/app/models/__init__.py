from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase): # define the Base
    pass

from app.models.users import User