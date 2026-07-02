from passlib.context import CryptContext
from jose import JWTError, jwt
import uuid
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.users import User
from app.database import AsyncSessionLocal
from app.core.config import settings
from app.core.logger import logger

# ── Password Utils ──────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ── Token utils ──────────────────────────────────────────
def create_access_token(data: dict, temp: bool = False):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=1440 if temp else settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str):
    try:
        logger.info("verifying token")
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None

# ── Auth dependency ──────────────────────────────────────
http_bearer = HTTPBearer()
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(http_bearer)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

# ── Fixed authLogin ──────────────────────────────────────
async def authLogin(key: str, password: str):
    try:
        async with AsyncSessionLocal() as session:
            logger.info(f"attempting login for user: {key}")
            stmt = select(User).where(User.username == key)
            user = await session.execute(stmt)
            user = user.scalars().first()
            if not user:
                logger.warning(f"login failed: user {key} not found")
                return {
                    "status": False,
                    "status_code": 404,
                    "message": "user not found"
                }
            elif not verify_password(password, user.password):
                logger.warning(f"login failed: incorrect password for user {key}")
                return {
                    "status": False,
                    "status_code": 401,
                    "message": f"wrong password for {user.username}"
                }
            token = create_access_token({
                "uid": str(user.uid),
                "username": user.username
            })
            return {
                "status": True,
                "status_code": 200,
                "access_token": token,
                "username": user.username
            }
    except Exception as e:
        logger.error(f"error occurred while logging in: {e}")
        return {
            "status": False,
            "status_code": 404,
            "message": f"{e}"
        }

async def authSignup(user_info: User) -> bool:
    try:
        async with AsyncSessionLocal() as session:
            logger.info(f"attempting signup for user: {user_info.username}")
            user_info.password = hash_password(user_info.password)
            session.add(user_info)
            await session.commit()
            return True
    except Exception as e:
        logger.error(f"error occurred while signing up user {user_info.username}: {e}")
        return False
    
def guestLogin() -> dict:
    username = f"guest_{uuid.uuid4().hex[:8]}"
    token = create_access_token({
        "uid": -1, "username": username
    }, temp=True)
    return {
        "status": True,
        "status_code": 200,
        "username": username,
        "access_token": token
    }

async def checkUsername(username: str) -> int:
    try:
        async with AsyncSessionLocal() as session:
            logger.info(f"checking for username: {username}")
            result = await session.execute(
                select(User).where(User.username == username)
            )
            availabilty = result.scalar_one_or_none() is None
            return {"availability": int(availabilty)}
    except Exception as e:
        logger.error(f"couldn't check availability for username - {username}: {e}")
        return -1