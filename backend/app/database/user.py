from time import time
from datetime import datetime
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.database.redis import joinWaitlist, leaveWaitlist, filterWaitlist, setMatchResult, getMatchResult, delMatchResult
from app.models.users import User
from app.core.logger import logger

async def getUser(key: str):
    """
    Get a user's info by their username.  
    
    :param key: username
    :type key: str
    """
    try:
        async with AsyncSessionLocal() as session:
            logger.info(f"attempting to retrieve user: {key}")
            stmt = select(User).where(User.username == key)
            user = await session.execute(stmt)
            user = user.scalars().first()
            if not user:
                logger.warning(f"user not found: {key}")
                return {
                    "status": False,
                    "status_code": 404,
                    "message": "user not found"
                }
            logger.info(f"user found: {key}")
            return {
                "status": True,
                "status_code": 200,
                "data": {
                    "email": user.email,
                    "display_name": user.display_name,
                    "bio": user.bio,
                    "age": datetime.now().year - user.birth_year,
                    "gender": user.gender,
                    "interests": user.interests.split(),
                    "languages": user.languages.split()
                }            
            }
    except Exception as e:
        logger.error(f"error retrieving user: {e}")
        return {
            "status": False,
            "status_code": 404,
            "message": f"{e}"
        }
    
async def xploreWaitlist(username: str, preferred_gender: str):
    user_info = await getUser(username)
    user_info["data"]["genders"] = [user_info["data"]["gender"], preferred_gender]

    await joinWaitlist(
        username= username,
        genders= user_info["data"]["genders"],
        languages= user_info["data"]["languages"],
        interests= user_info["data"]["interests"]
    )
    curr_match = {}
    start_xplore, xplore_duration = time(), time()

    while xplore_duration - start_xplore < 10: # stop after 10 seconds
        # Look for an existing match
        match_result = await getMatchResult(username)
        if match_result:
            details = match_result.split(":")
            await delMatchResult(username)
            await leaveWaitlist(username)
            return {
                "status": True,
                "room_id": details[0],
                "match": details[1]
            }
        
        # search for a match if it doesn't exist
        filter_res = await filterWaitlist(
            user_id= username,
            genders= user_info["data"]["genders"],
            languages= user_info["data"]["languages"],
            interests= user_info["data"]["interests"]
        )
        if filter_res:
            curr_match = filter_res[0]
            room_id = str(xplore_duration)[-4:]
            await setMatchResult(
                username=curr_match["username"],
                details=f"{room_id}:{username}"
            )
            await leaveWaitlist(username)
            return {
                "status": True,
                "room_id": room_id,
                "match": curr_match["username"]
            }
        xplore_duration = time()
    return {
        "status": False,
        "message": "could not find a match."
    }