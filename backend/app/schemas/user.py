from pydantic import BaseModel
from typing import List

# REQUEST
class UserInfoReq(BaseModel):
    token: str

class XploreRequest(BaseModel):
    username: str
    preferred_gender: str

# RESPONSE
class UserInfoRes(BaseModel):
    user_id: int
    username: str
    email: str

    display_name: str
    bio: str
    age: int
    interests: List[str]
    languages: List[str]


class WSMessage(BaseModel):
    content: str
    sender: str = "a"
    content_type: str = "message"