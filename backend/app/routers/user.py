from fastapi import APIRouter, Depends #, HTTPException

from app.schemas.user import XploreRequest
from app.database.auth import get_current_user
from app.database.user import getUser, xploreWaitlist

router = APIRouter(prefix='/user', tags=['user'])

@router.get("/me")
async def get_me(token = Depends(get_current_user)):
    return await getUser(token["username"])

@router.post("/xplore")
async def xplore(req: XploreRequest):
    result = await xploreWaitlist(
            username=req.username,
            preferred_gender=req.preferred_gender
        )
    return result