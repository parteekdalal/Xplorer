from fastapi import APIRouter, HTTPException

from app.database.auth import authLogin, authSignup, guestLogin, create_access_token, checkUsername
from app.models import User
from app.schemas.auth import SignupRequest, LoginRequest

router = APIRouter(prefix='/auth', tags=['authentication'])

# --- endpoints --- 
@router.post('/login')
async def login(req: LoginRequest):
    login_res = await authLogin(key=req.key, password=req.password)
    if not login_res['status']:
        raise HTTPException(status_code=login_res['status_code'], detail=login_res['message'])
    return login_res
    
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
        login_res = await authLogin(key=req.username, password=req.password)
        if login_res["status"]: return login_res
    else:
        raise HTTPException(status_code= 400, detail= "signup failed")
    
@router.post("/guest")
def guest():
    return guestLogin()
    
@router.get("/check_username/{username}")
async def check_username(username: str):
    availability = await checkUsername(username=username)
    if availability == -1: HTTPException(status_code=404, detail=f"could not check for the username: {username}")
    return availability