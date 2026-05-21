from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.core.logger import logger
from app.core.middleware import log_requests
from app.routers import all_routers
from app.database.redis import init_redis, close_redis
from app.database import init_db, Base, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app started.")
    
    # Retry DB connection with exponential backoff
    for attempt in range(10):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            break
        except Exception as e:
            if attempt == 9:
                raise RuntimeError(f"DB unavailable after 10 attempts: {e}")
            wait = min(2 ** attempt, 20)
            logger.info(f"DB not ready (attempt {attempt+1}/10), retrying in {wait}s...")
            await asyncio.sleep(wait)
    await init_db()
    await init_redis()
    yield
    await close_redis()

app = FastAPI(
    title=       "xplorer backend",
    description= "Backend API for Xplorer. A platform to find like-minded people online",
    version=     "0.1.0",
    lifespan=    lifespan
)

app.add_middleware(
    BaseHTTPMiddleware,
    dispatch=log_requests
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- routers ---
for router in all_routers:
    app.include_router(router)

@app.get("/")
def health():
    return {
        "status": True,
        "status_code": 200,
        "message": "Xplorer is live."
    }