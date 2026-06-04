from pydantic import BaseModel, Field
from typing import Optional, List

class LoginRequest(BaseModel):
    key: str = Field(..., title="username")
    password: str = Field(..., title="password")

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[str] = Field("")
    password: str = Field(..., min_length=8, max_length=256)
    birth_year: int = Field(..., gt=1900, lt=2025)
    gender: str = Field(...)
    display_name: Optional[str] = Field("", max_length=50)
    bio: Optional[str] = Field("", max_length=255)
    interests: Optional[List[str]] = Field([])
    languages: Optional[List[str]] = Field([])