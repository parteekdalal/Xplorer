from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.models import Base
from app.core.config import settings
from app.core.logger import logger

engine = create_async_engine(settings.POSTGRES_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Dependency — inject into routes
async def get_db():
    logger.info("creating a new database session")
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    logger.info("initializing postgres database")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
