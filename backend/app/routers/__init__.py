"""
# Routers

- admin: admin routers (methods that require high-level access)
- users: user routers (user level methods)
"""

from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.websocket import router as ws_router

all_routers = [auth_router, user_router, ws_router]