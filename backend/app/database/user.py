from datetime import datetime
from sqlalchemy import select

from database import AsyncSessionLocal
from app.models.users import User
from app.core.logger import logger

async def getUser(key: str):
    try:
        async with AsyncSessionLocal() as session:
            logger.info(f"attempting to retrieve user: {key}")
            stmt = session.select(User).where(User.username == key)
            user = await session.execute(stmt).scalars().first()
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
                    "uid": user.id,
                    "username": user.username,
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