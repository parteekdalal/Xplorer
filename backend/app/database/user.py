import asyncio
import uuid
from time import time
from datetime import datetime
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.database.redis import getRedis, joinWaitlist, leaveWaitlist, filterWaitlist, setMatchResult, getMatchResult, delMatchResult
from app.models.users import User
from app.core.logger import logger


# Atomically claims a match:
#   KEYS[1] = match_results hash
#   KEYS[2] = waitlist hash
#   ARGV[1] = candidate username
#   ARGV[2] = match detail string  "{room_id}:{initiator}"
#   ARGV[3] = initiator username
#
# Uses HSETNX to claim candidate's slot — if it's already claimed by another
# initiator, this is a no-op and returns 0. On success, removes both parties
# from the waitlist atomically.
_CLAIM_MATCH_LUA = """
local claimed = redis.call('HSETNX', KEYS[1], ARGV[1], ARGV[2])
if claimed == 1 then
    redis.call('HDEL', KEYS[2], ARGV[1])
    redis.call('HDEL', KEYS[2], ARGV[3])
end
return claimed
"""

POLL_INTERVAL  = 0.5   # seconds between Redis polls
XPLORE_TIMEOUT = 10.0  # total wait budget in seconds


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
    
async def xploreWaitlist(username: str, preferred_gender: str) -> dict:
    user_info = await getUser(username)
    data = user_info["data"]
    genders   = [data["gender"], preferred_gender]

    await joinWaitlist(
        username=username,
        genders=genders,
        languages=data["languages"],
        interests=data["interests"],
    )

    redis       = getRedis()
    claim_match = redis.register_script(_CLAIM_MATCH_LUA)
    deadline    = time() + XPLORE_TIMEOUT

    try:
        while time() < deadline:

            # 1. Were we matched by someone else?
            match_result = await getMatchResult(username)
            if match_result:
                room_id, matcher = match_result.split(":", 1)
                await delMatchResult(username)
                # leaveWaitlist handled by finally; the Lua script
                # already removed us when the other side claimed the match.
                return {"status": True, "room_id": room_id, "match": matcher}

            # 2. Try to claim a match ourselves
            candidates = await filterWaitlist(
                user_id=username,
                genders=genders,
                languages=data["languages"],
                interests=data["interests"],
            )

            for candidate in candidates:
                room_id      = uuid.uuid4().hex[:6]
                match_detail = f"{room_id}:{username}"

                claimed = await claim_match(
                    keys=["match_results", "waitlist"],
                    args=[candidate["username"], match_detail, username],
                )

                if claimed:
                    # Lua already removed both parties from the waitlist.
                    return {
                        "status":  True,
                        "room_id": room_id,
                        "match":   candidate["username"],
                    }
                # Candidate was sniped by a concurrent initiator — try next.

            await asyncio.sleep(POLL_INTERVAL)

    finally:
        # Guaranteed cleanup: covers timeout, passive match, and any
        # unexpected exception. HDEL on a missing key is a no-op.
        await leaveWaitlist(username)

    return {"status": False, "message": "could not find a match."}
