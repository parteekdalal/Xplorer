from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from redis import Redis
import httpx

# from app.database import SessionLocal  # Initialize database and create tables
from app.routers import all_routers
from app.database.redis import init_redis, close_redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_redis()       # startup
    yield
    await close_redis()      # shutdown

app = FastAPI(
    title=       "WanderHead",
    description= "A social app to find friends online.",
    version=     "0.0.1",
    lifespan=    lifespan
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
        "message": " WanderHead is live."
    }