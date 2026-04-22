from datetime import datetime
from app.models.users import User
from app.database import AsyncSessionLocal

def authLogin(key: str, password: str):
    try:
        with AsyncSessionLocal() as s:
            stmt = s.query(User).where(User.username == key)
            user = s.execute(stmt).scalars().first()
            if not user:
                return {
                    "status": False,
                    "status_code": 401,
                    "message": "wrong credentials"
                }
            elif user.password != password:
                return {
                    "status": False,
                    "status_code": 401,
                    "message": f"wrong password for {user.username}"
                }
            return {
                "status": True,
                "status_code": 200,
                "data": {
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
        return {
            "status": False,
            "status_code": 404,
            "message": f"{e}"
        }

def authSignup(username: str, email: str, password: str, birth_year: int, gender: str, display_name: str = None, bio: str = "", interests: list[str] = None, languages: list[str] = None):
    new_user = User(
        username=      username,
        email=         email,
        password=      password,
        display_name=  display_name if display_name else "",
        bio=           bio if bio else "no bio",
        birth_year=    birth_year,
        gender=        gender,

        interests =    " ".join(interests) if interests else "",
        languages=     " ".join(languages) if languages else ""
    )
    try:
        with AsyncSessionLocal() as s:
            s.add(new_user)
            s.commit()
            return {
                "status": True,
                "status_code": 200,
                "message": "welcome to wanderhead",
                "data": [
                    new_user.username,
                    new_user.email,
                    new_user.display_name,
                    new_user.bio,
                    new_user.birth_year,
                    new_user.gender,
                    new_user.interests.split(),
                    new_user.languages.split()
                ]
            }
    except Exception as e:
        return {
            "status": False,
            "status_code": 400,
            "message": f"error: {e}"
        }