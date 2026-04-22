from fastapi import APIRouter, HTTPException

from app.schemas.user import DiscoverRequest
from app.database.redis import joinWaitlist

router = APIRouter(prefix='/user', tags=['user'])

"""
TODO

GET, POST, PUT, DELETE

- discover

"""

@router.post("/discover")
async def discover(req: DiscoverRequest):
    """
    - add uid to the waitlist.
    - create a room if no rooms are available.
    - add n ppl to rooms.
    """
    joinWaitlist(req.uid, req.genders, )