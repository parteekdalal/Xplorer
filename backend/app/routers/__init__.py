from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.xplore_ws import router as xplore_router
from app.routers.public_rooms_ws import router as public_rooms_router

all_routers = [auth_router, user_router, xplore_router, public_rooms_router]