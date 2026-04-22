from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

from app.models import Base
from app.config import settings

engine = create_async_engine(settings.POSTGRES_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Dependency — inject into routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# engine = create_engine(
#     settings.POSTGRES_URL,
#     pool_size=10,
#     max_overflow=20
# )

# SessionLocal = sessionmaker(bind=engine) # create session