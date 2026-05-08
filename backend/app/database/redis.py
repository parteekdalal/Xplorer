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
    return redis_client

# --- METHODS ---
async def joinWaitlist(username: str, genders: list[str], interests: list[str] = [], languages: list[str] = []) -> dict:
    redis = getRedis()

    genders = "_".join(genders) if genders else "a_a"
    interests = "_".join(interests) if interests else "_"
    languages = "_".join(languages) if languages else "english"

    preferences = f"{genders}:{interests}:{languages}"
    logger.info(f"Adding to waitlist: {username}")
    await redis.hset(
        name="waitlist",
        key=username,
        value=preferences
    )
    return {
        "username": username,
        "genders": genders,
        "languages": languages,
        "interests": interests
    }

async def leaveWaitlist(username: str) -> None:
    redis = getRedis()
    await redis.hdel("waitlist", username)

# --- access waitlist data ---
async def getWaitlist() -> dict[str, str]:
    redis = getRedis()
    data = await redis.hgetall("waitlist")
    return data

def getWaitlistUser(uid: str) -> dict:
    redis = getRedis()
    logger.info(f"waitlist: getting user: {uid}")
    user = redis.hget("waitlist", uid)
    genders_str, uinterests_str, ulangs_str = user.split(":")
    ugenders = genders_str.split("_")
    uinterests = uinterests_str.split("_") if uinterests_str != "_" else []
    ulangs = ulangs_str.split("_") if ulangs_str != "_" else []
    return {
        'uid': uid,
        'genders': ugenders,
        'interests': uinterests,
        'languages': ulangs
    }

async def createRoom(room_id: str, owner: str):
    redis = getRedis()
    await redis.hset(
        name="rooms",
        key=owner,
        value=room_id
    )

async def getRoomId(owner: str) -> str|None:
    redis = getRedis()
    room = await redis.hget(
        name="rooms",
        key=owner
    )
    return room if room else None

async def setMatchResult(username:str, details:str):
    redis = getRedis()
    await redis.hset(
        name="match_results",
        key=username,
        value=details
    )
async def getMatchResult(username:str):
    redis = getRedis()
    return await redis.hget(name="match_results", key=username)

async def delMatchResult(username:str):
    redis = getRedis()
    await redis.hdel("match_results", username)

async def filterWaitlist(user_id: str, genders: list[str] = ["a", "a"], languages: list[str] = ["english"], interests: list[str] = None):
    """
    Filter waitlist and return matches with match score.  
    
    ---
    ## Proccess
    - filter the entries of the waitlist based on gender, interests, languages.
    - return sorted list of matching entries by match score [interests + languages].
    """
    waitlist = await getWaitlist()
    matches = []
    if waitlist:
        for uid, preferences in waitlist.items():
            if uid == user_id: continue
            score = 0
            ugenders, uinterests_str, ulangs_str = preferences.split(":")

            if genders:
                my_gender, my_preferred_gender = genders
                candidate_gender, candidate_preferred_gender = ugenders.split("_")

                if my_preferred_gender != "a" and my_preferred_gender != candidate_gender: continue           # am i interested?
                if candidate_preferred_gender != "a" and candidate_preferred_gender != my_gender: continue    # is the other person interest?
            
            # match languages
            if languages and ulangs_str != "_":
                ulangs = ulangs_str.split("_")
                l_score = 0
                for l in languages:
                    if l in ulangs:
                        l_score+=2
                if l_score: score+=l_score
                else: continue

            # match interests
            if interests and uinterests_str != "_":
                uinterests = uinterests_str.split("_")
                i_score = 0
                for i in interests:
                    if i in uinterests:
                        i_score+=2
                if i_score: score+=i_score
                else: continue
            
            matches.append({
                'username': uid,
                'gender': ugenders[0],
                'interests': uinterests_str.split("_"),
                'languages': ulangs_str.split("_"),
                'match': score
            })
    matches.sort(key=lambda x: x['match'], reverse=True)
    return matches