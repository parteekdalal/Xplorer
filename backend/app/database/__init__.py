from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.models import Base
from app.core.config import settings
from app.core.logger import logger

postgres_url = f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
engine = create_async_engine(postgres_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

@asynccontextmanager        
async def get_db():
    logger.info("creating a new database session")
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    logger.info("initializing postgres database")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
