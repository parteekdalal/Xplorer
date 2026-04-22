from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class LoginRequest(BaseModel):
    key: str = Field(..., title="email or username")
    password: str = Field(..., title="password")
    login_by_email: bool = Field(..., title="login with email or username?")

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)
    birth_year: int = Field(...)
    gender: str = Field(...)
    display_name: Optional[str] = Field(None, max_length=50)
    bio: Optional[str] = Field(None, max_length=255)
    interests: Optional[List] = Field(None)
    languages: Optional[List] = Field(None)

class SignupResponse(BaseModel):
    uid: int
    username: str
    display_name: str