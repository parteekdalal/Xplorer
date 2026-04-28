from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class LoginRequest(BaseModel):
    key: str = Field(..., title="username")
    password: str = Field(..., title="password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)
    birth_year: int = Field(...)
    gender: str = Field(..., )
    display_name: Optional[str] = Field(..., max_length=50, nullable=False)
    bio: Optional[str] = Field(..., max_length=255, nullable=True)
    interests: Optional[List] = Field(...)
    languages: Optional[List] = Field(None)

class SignupResponse(BaseModel):
    uid: int
    username: str
    display_name: str