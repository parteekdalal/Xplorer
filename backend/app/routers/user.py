from fastapi import APIRouter, HTTPException, Depends

from app.schemas.user import DiscoverRequest
from app.database.redis import joinWaitlist, getWaitlist, createRoom
from app.database.auth import get_current_user
from app.database.user import getUser

router = APIRouter(prefix='/user', tags=['user'])

"""
TODO

GET, POST, PUT, DELETE

- discover

"""
@router.get("/me")
async def get_me(user = Depends(get_current_user)):
    return await getUser(user["username"])


@router.post("/discover")
async def discover(req: DiscoverRequest):
    """
    - add uid to the waitlist.
    - create a room if no rooms are available.
    - add n ppl to rooms.
    """
    joinWaitlist(req.uid, req.genders)
    wlist = await getWaitlist()

    for uid, info in wlist.items:
        if uid !=req.uid:
            rid = str(uid)+str(req.uid)
            createRoom(
                room_id=rid,
                users=f"{uid}:{req.uid}")
            return rid