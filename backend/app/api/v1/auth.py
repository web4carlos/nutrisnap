from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.auth.dependencies import get_db
from app.schemas.auth import LoginRequest,LogoutRequest,MessageResponse,RefreshRequest,RegisterRequest,TokenPairResponse,UserResponse
from app.services.auth_service import AuthService,AuthenticationError,DuplicateEmailError,InactiveUserError
router=APIRouter(prefix="/auth",tags=["Authentication"])
@router.post("/register",response_model=TokenPairResponse,status_code=201)
def register(r:RegisterRequest,db:Session=Depends(get_db)):
    try:return AuthService(db).register(r)
    except DuplicateEmailError as exc:raise HTTPException(409,str(exc)) from exc
@router.post("/login",response_model=TokenPairResponse)
def login(r:LoginRequest,db:Session=Depends(get_db)):
    try:return AuthService(db).login(r)
    except AuthenticationError as exc:raise HTTPException(401,str(exc)) from exc
    except InactiveUserError as exc:raise HTTPException(403,str(exc)) from exc
@router.post("/refresh",response_model=TokenPairResponse)
def refresh(r:RefreshRequest,db:Session=Depends(get_db)):
    try:return AuthService(db).refresh(r.refresh_token)
    except AuthenticationError as exc:raise HTTPException(401,str(exc)) from exc
@router.post("/logout",response_model=MessageResponse)
def logout(r:LogoutRequest,db:Session=Depends(get_db)):
    try:AuthService(db).logout(r.refresh_token)
    except AuthenticationError as exc:raise HTTPException(401,str(exc)) from exc
    return MessageResponse(message="Logged out successfully")
@router.get("/me",response_model=UserResponse)
def me(user=Depends(get_current_user)):return user
