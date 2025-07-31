from fastapi import APIRouter, HTTPException, Depends, Request, Response
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..models import User
from ..db import engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..auth import (
    get_current_user, 
    get_current_user_optional, 
    create_access_token, 
    create_refresh_token,
    set_auth_cookies,
    clear_auth_cookies,
    SECRET_KEY,
    ALGORITHM
)
from ..utils.password import validate_password, hash_password_for_bcrypt
from ..middleware.rate_limit import rate_limit_login, rate_limit_register

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

router = APIRouter()

# Pydantic models for request/response validation
class UserRegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    username: str
    password: str
    remember_me: bool = False

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

def get_password_hash(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/users/register", response_model=UserResponse)
def register_user(user_data: UserRegisterRequest, request: Request, response: Response):
    """
    Register a new user with enhanced security.
    
    Features:
    - Rate limiting to prevent abuse
    - Input validation
    - Secure password hashing
    - Duplicate user prevention
    - Automatic login after registration
    """
    # Apply rate limiting
    rate_limit_register(request)
    
    # Basic input validation (keeping it simple for testing)
    if not user_data.username or not user_data.email or not user_data.password:
        raise HTTPException(status_code=400, detail="All fields are required")
    
    # Simple email format check
    if "@" not in user_data.email or "." not in user_data.email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    with Session(engine) as session:
        # Check for existing user
        existing = session.exec(
            select(User).where(
                (User.username == user_data.username) | 
                (User.email == user_data.email)
            )
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=400, 
                detail="Username or email already registered"
            )
        
        # Create new user
        user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            is_admin=False  # No automatic admin assignment for security
        )
        
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Automatically log in the user after registration
        access_token = create_access_token(data={"sub": user.username, "email": user.email})
        refresh_token = create_refresh_token(data={"sub": user.username, "email": user.email})
        
        # Set HTTP-only cookies
        set_auth_cookies(response, access_token, refresh_token, remember_me=False)
        
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            is_admin=user.is_admin,
            created_at=user.created_at
        )

@router.post("/users/login")
def login(
    login_data: UserLoginRequest, 
    request: Request, 
    response: Response
):
    """
    Login user with enhanced security.
    
    Features:
    - Rate limiting
    - Secure password verification
    - HTTP-only cookies
    - Remember me functionality
    - Consistent error messages (prevents user enumeration)
    """
    # Apply rate limiting
    rate_limit_login(request)
    
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.username == login_data.username)
        ).first()
        
        # Use consistent error message to prevent user enumeration
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        # Create tokens
        access_token = create_access_token(
            data={"sub": user.username, "email": user.email}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.username, "email": user.email}
        )
        
        # Set HTTP-only cookies
        set_auth_cookies(
            response, 
            access_token, 
            refresh_token, 
            remember_me=login_data.remember_me
        )
        
        # Return user info (tokens are in cookies)
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            },
            "message": "Login successful"
        }

@router.post("/users/logout")
def logout(response: Response):
    """
    Logout user by clearing authentication cookies.
    """
    clear_auth_cookies(response)
    return {"message": "Logged out successfully"}

@router.post("/users/refresh")
async def refresh_token(request: Request, response: Response):
    """
    Refresh access token using refresh token from cookie.
    
    This endpoint allows clients to get a new access token without
    requiring the user to log in again.
    """
    try:
        # Get refresh token from cookie
        refresh_token = request.cookies.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(
                status_code=401, 
                detail="Refresh token not found"
            )
        
        # Decode and validate refresh token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        email = payload.get("email")
        token_type = payload.get("type")
        
        if not username or token_type != "refresh":
            raise HTTPException(
                status_code=401, 
                detail="Invalid refresh token"
            )
        
        # Verify user still exists
        with Session(engine) as session:
            user = session.exec(
                select(User).where(User.username == username)
            ).first()
            
            if not user:
                raise HTTPException(
                    status_code=401, 
                    detail="User not found"
                )
        
        # Create new access token
        new_access_token = create_access_token(
            data={"sub": username, "email": email or user.email}
        )
        
        # Update the access token cookie
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            max_age=15 * 60,  # 15 minutes
            httponly=True,
            secure=True,
            samesite="lax",
            path="/"
        )
        
        return {"message": "Token refreshed successfully"}
        
    except JWTError:
        raise HTTPException(
            status_code=401, 
            detail="Invalid refresh token"
        )

@router.get("/users/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current user information.
    Protected route that requires valid authentication.
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        is_admin=current_user.is_admin,
        created_at=current_user.created_at
    )

# Legacy OAuth2 endpoint for API clients (keeps backward compatibility)
@router.post("/users/login/oauth2")
def login_oauth2(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2-compatible login endpoint for API clients.
    Returns tokens in response body (not cookies).
    """
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.username == form_data.username)
        ).first()
        
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        access_token = create_access_token(
            data={"sub": user.username, "email": user.email}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.username, "email": user.email}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": 900
        } 