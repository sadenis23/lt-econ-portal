from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from ..models import User
from ..db import engine
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .auth import get_current_user, get_current_user_optional

SECRET_KEY = "supersecretkey"  # In production, use env vars
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

router = APIRouter()

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/users/register")
def register_user(user: User, current_user: User = Depends(get_current_user_optional)):
    with Session(engine) as session:
        user_count = len(session.exec(select(User)).all())
        # If no users exist, allow registration without authentication
        if user_count == 0:
            current_user = None
        # Allow first user to be admin, require admin for others
        if user.is_admin:
            if user_count > 0 and (not current_user or not current_user.is_admin):
                raise HTTPException(status_code=403, detail="Only admins can create admin users")
        existing = session.exec(select(User).where((User.username == user.username) | (User.email == user.email))).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username or email already registered")
        user.password_hash = get_password_hash(user.password_hash)
        session.add(user)
        session.commit()
        session.refresh(user)
        return {"id": user.id, "username": user.username, "email": user.email, "is_admin": user.is_admin}

@router.post("/users/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == form_data.username)).first()
        if not user or not verify_password(form_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"} 