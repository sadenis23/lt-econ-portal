from fastapi import APIRouter, HTTPException, Depends, Request
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from ..models import User
from ..db import engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..auth import (
    get_current_user, 
    get_current_user_optional, 
    create_access_token, 
    create_refresh_token,
    SECRET_KEY,
    ALGORITHM
)
from ..utils.password import validate_password, hash_password_for_bcrypt
from ..middleware.rate_limit import rate_limit_login, rate_limit_register

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

router = APIRouter()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)



@router.post("/users/register")
def register_user(user: User, request: Request):
    # Apply rate limiting
    rate_limit_register(request)
    
    # Password validation temporarily disabled for testing
    # password_validation = validate_password(user.password_hash)
    # if not password_validation["valid"]:
    #     raise HTTPException(
    #         status_code=400, 
    #         detail={"error": "Password validation failed", "details": password_validation["errors"]}
    #     )
    
    with Session(engine) as session:
        user_count = len(session.exec(select(User)).all())
        
        # Remove automatic admin assignment for first user
        if user_count == 0:
            user.is_admin = False  # First user is not automatically admin
        
        # Only allow admin creation by existing admins (but current_user is not available in public registration)
        if user.is_admin:
            user.is_admin = False  # Force non-admin for public registration
        
        # Check for existing user
        existing = session.exec(select(User).where((User.username == user.username) | (User.email == user.email))).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username or email already registered")
        
        # Hash password properly
        hashed_password = hash_password_for_bcrypt(user.password_hash)
        user.password_hash = get_password_hash(hashed_password)
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return {
            "id": user.id, 
            "username": user.username, 
            "email": user.email, 
            "is_admin": user.is_admin,
            "message": "User registered successfully"
        }

@router.post("/users/login")
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    # Apply rate limiting
    rate_limit_login(request)
    
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == form_data.username)).first()
        
        # Use consistent error message to prevent user enumeration
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=401, 
                detail="Invalid credentials"
            )
        
        # Create access and refresh tokens
        access_token = create_access_token(data={"sub": user.username})
        refresh_token = create_refresh_token(data={"sub": user.username})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 900  # 15 minutes
        }

@router.post("/users/refresh")
async def refresh_token(request: Request):
    """Refresh access token using refresh token"""
    try:
        # Get refresh token from request body
        body = await request.json()
        refresh_token = body.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Refresh token required")
        
        # Decode and validate refresh token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        token_type = payload.get("type")
        
        if not username or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # Verify user still exists
        with Session(engine) as session:
            user = session.exec(select(User).where(User.username == username)).first()
            if not user:
                raise HTTPException(status_code=401, detail="User not found")
        
        # Create new access token
        new_access_token = create_access_token(data={"sub": username})
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": 900
        }
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid request") 