from redis.asyncio import from_url
from app.core.config import settings
from app.core.logger import logger


redis_client = None

async def init_redis():
    logger.info("Initializing Redis connection...")
    global redis_client
    redis_client = await from_url(settings.REDIS_URL, decode_responses=True)

async def close_redis():
    await redis_client.close()

def getRedis():
    logger.info("Retrieving Redis client")
    return redis_client

# --- METHODS ---
async def joinWaitlist(uid: int, genders: list[str], interests: list[str] = [], languages: list[str] = []):
    redis = getRedis()
    genders = "_".join(genders)
    interests = "_".join(interests) if interests else "_"
    languages = "_".join(languages) if languages else "_"
    logger.info(f"Adding user {uid} to wait")
    await redis.hset(
        name="waitlist",
        key=str(uid),
        value=f"{genders}:{interests}:{languages}"
    )

async def leaveWaitlist(uid: int):
    redis = getRedis()
    await redis.hdel("waitlist", str(uid))


# --- access waitlist data ---
async def getWaitlist() -> dict[str, str]:
    redis = getRedis()
    logger.info("Retrieving waitlist data")
    data = await redis.hgetall("waitlist")
    return data

def getWaitlistUser(uid: int) -> dict:
    redis = getRedis()
    logger.info(f"Retrieving user {uid} from waitlist")
    user = redis.hget("waitlist", str(uid))
    genders_str, uinterests_str, ulangs_str = user.split(":")
    ugenders = genders_str.split("_")
    uinterests = uinterests_str.split("_") if uinterests_str != "_" else []
    ulangs = ulangs_str.split("_") if ulangs_str != "_" else []
    return {
        'uid': int(uid),
        'genders': ugenders,
        'interests': uinterests,
        'languages': ulangs
    }

async def createRoom(room_id: str, users: str = ""):
    redis = getRedis()
    redis.hset(
        name="rooms",
        key=room_id,
        value=users   
    )    

async def filterWaitlist(genders: list[str] = None, interests: list[str] = None, languages: list[str] = None):
    """
    - filter the entries of the waitlist based on gender, interests, languages.
    - return sorted list of matching entries by match score (interests + languages matches)
    """
    waitlist = await getWaitlist()
    matches = []
    if waitlist:
        for uid, info in waitlist.items():
            ugenders, uinterests_str, ulangs_str = info.split(":")
            uinterests = uinterests_str.split("_") if uinterests_str != "_" else []
            ulangs = ulangs_str.split("_") if ulangs_str != "_" else []
            
            # Filter by gender preferences
            if genders:
                my_gender, my_preferred_gender = genders
                candidate_gender, candidate_preferred_gender = ugenders

                # current user must accept the candidate
                if my_preferred_gender != "a" and my_preferred_gender != candidate_gender:
                    continue
                # candidate must accept the current user
                if candidate_preferred_gender != "a" and candidate_preferred_gender != my_gender:
                    continue
            
            # Check interests match (any overlap if interests provided)
            interests_match = not interests or bool(set(interests) & set(uinterests))
            if interests and not interests_match:
                continue
            
            # Check languages match (any overlap if languages provided)
            langs_match = not languages or bool(set(languages) & set(ulangs))
            if languages and not langs_match:
                continue
            
            # Calculate match score
            score = (len(set(interests or []) & set(uinterests)) + 
                     len(set(languages or []) & set(ulangs)))
            
            matches.append({
                'uid': int(uid),
                'gender': ugenders,
                'interests': uinterests,
                'languages': ulangs,
                'score': score
            })
    
    # Sort by score descending
    matches.sort(key=lambda x: x['score'], reverse=True)
    return matches