"""
GOALS
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List
# REQUEST
class UserInfoReq(BaseModel):
    username: str

# RESPONSE
class UserInfoRes(BaseModel):
    user_id: int
    username: str
    email: EmailStr

    display_name: str
    bio: str
    age: int
    interests: List
    Languages: List

class DiscoverRequest(BaseModel):
    uid: int
    genders: str
    interests: List
    languages: List