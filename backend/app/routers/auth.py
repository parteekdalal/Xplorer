from fastapi import APIRouter, HTTPException

from app.database.auth import authLogin, authSignup
from app.schemas.auth import SignupRequest, LoginRequest


router = APIRouter(prefix='/auth', tags=['authentication'])


# --- endpoints --- 
@router.post('/login')
def login(req: LoginRequest):
    db_res = authLogin(key=req.key, password=req.password, loginByEmail=req.login_by_email)
    
    if db_res['status']:
        return db_res
    else:
        raise HTTPException(status_code=db_res['status_code'], detail=db_res['message'])
    
@router.post('/signup')
def signup(request: SignupRequest):
    db_res = authSignup(
        username=request.username.lower(),
        email=request.email.lower(),
        password=request.password,
        birth_year=request.birth_year,
        display_name=request.display_name,
        bio= request.bio,
        interests= request.interests,
        languages= request.languages
    )
    if db_res["status"]:
        return db_res
    else: raise HTTPException(
        status_code= db_res["status_code"],
        detail= db_res["message"]
    )