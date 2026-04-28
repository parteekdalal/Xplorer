from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_URL: str  # "postgresql://postgres:postgres@localhost/wanderhead"
    REDIS_URL: str # "redis://localhost:6379"
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"

settings = Settings()