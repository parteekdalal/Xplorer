from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_URL: str  # "postgresql://postgres:postgres@localhost/wanderhead"
    REDIS_URL: str

    class Config:
        env_file = ".env"

settings = Settings()