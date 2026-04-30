from fastapi import APIRouter, HTTPException

from app.database.auth import authLogin, authSignup, create_access_token
from app.models import User
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse
from app.core.logger import logger

router = APIRouter(prefix='/auth', tags=['authentication'])

# --- endpoints --- 
@router.post('/login', response_model=TokenResponse)
async def login(req: LoginRequest):
    login_res = await authLogin(key=req.key, password=req.password)
    if not login_res['status']:
        raise HTTPException(status_code=login_res['status_code'], detail=login_res['message'])
    token = create_access_token({
        "uid": str(login_res["uid"]),
        "username": login_res["username"]
    })
    return {
        "status": True,
        "status_code": 200,
        "access_token": token
        }
    
@router.post('/signup')
async def signup(req: SignupRequest):
    user_info = User(
        username= req.username.lower(),
        email= req.email.lower(),
        password= req.password,
        birth_year= req.birth_year,
        gender= req.gender[0].lower(),
        display_name= req.display_name,
        bio= req.bio,
        interests= " ".join(req.interests) if req.interests else "",
        languages= " ".join(req.languages) if req.languages else ""
    )
    signup_res: bool = await authSignup(user_info)
    if signup_res:
        login_res = await authLogin(key=req.username,
                              password=req.password)
        if login_res["status"]:

            token = create_access_token({
                "uid": str(login_res["uid"]),
                "username": login_res["username"]
            })
            return {
                "status": True,
                "status_code": 200,
                "message": "welcome to wanderhead",
                "access_token": token
            }
    else:
        raise HTTPException(
            status_code= 400,
            detail= "signup failed"
        )