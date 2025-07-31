import os
import secrets
from fastapi import Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer
from jose import jwt, JWTError
from sqlmodel import Session, select
from typing import Union, Optional
from datetime import datetime, timedelta
from .models import User
from .db import engine

# Generate secure secret key if not provided
def generate_secret_key():
    return secrets.token_urlsafe(32)

# Load configuration from environment variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY", generate_secret_key())
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# OAuth2 scheme for API access (Bearer tokens)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login", auto_error=False)

# HTTP Bearer for fallback token extraction
http_bearer = HTTPBearer(auto_error=False)

def get_token_from_cookie_or_header(request: Request, token: Optional[str] = Depends(oauth2_scheme)) -> Optional[str]:
    """
    Extract token from HTTP-only cookie first, then from Authorization header as fallback.
    This allows both cookie-based auth (for web) and token-based auth (for API).
    """
    # First try to get from cookie (for web clients)
    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        return cookie_token
    
    # Fallback to Authorization header (for API clients)
    if token:
        return token
    
    # Try HTTP Bearer as last resort
    bearer_token = request.headers.get("authorization")
    if bearer_token and bearer_token.startswith("Bearer "):
        return bearer_token.split(" ")[1]
    
    return None

def get_current_user(token: Optional[str] = Depends(get_token_from_cookie_or_header)) -> User:
    """
    Get current user from token (cookie or header).
    Raises 401 if token is invalid or missing.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type", "access")
        
        if username is None or token_type != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if user is None:
            raise credentials_exception
        return user

def get_current_user_optional(token: Optional[str] = Depends(get_token_from_cookie_or_header)) -> Union[User, None]:
    """
    Get current user from token, but return None instead of raising exception.
    Useful for optional authentication.
    """
    try:
        return get_current_user(token)
    except HTTPException:
        return None

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def set_auth_cookies(response: Response, access_token: str, refresh_token: str, remember_me: bool = False):
    """
    Set HTTP-only cookies for authentication.
    
    Args:
        response: FastAPI response object
        access_token: JWT access token
        refresh_token: JWT refresh token  
        remember_me: If True, extends refresh token expiry
    """
    # Determine cookie expiry based on remember_me
    access_expiry = 15 * 60  # 15 minutes
    refresh_expiry = 30 * 24 * 60 * 60 if remember_me else 7 * 24 * 60 * 60  # 30 days vs 7 days
    
    # Set access token cookie (short-lived)
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=access_expiry,
        httponly=True,  # Prevents XSS attacks
        secure=True,    # Only sent over HTTPS
        samesite="lax", # Prevents CSRF attacks
        path="/"        # Available across the site
    )
    
    # Set refresh token cookie (longer-lived)
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token,
        max_age=refresh_expiry,
        httponly=True,
        secure=True,
        samesite="lax",
        path="/"
    )

def clear_auth_cookies(response: Response):
    """Clear authentication cookies on logout"""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/") 