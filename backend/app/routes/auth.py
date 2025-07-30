from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from app.models import User, Profile
from app.auth import get_current_user
from app.db import get_session

router = APIRouter()

@router.get("/api/auth/me")
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get current user information including profile completion status"""
    
    # Check if user has a profile
    profile = session.exec(select(Profile).where(Profile.user_id == current_user.id)).first()
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "profile_complete": profile.onboarding_completed if profile else False
    }

@router.post("/api/auth/logout")
def logout():
    """Logout endpoint - clears session"""
    # In a real implementation, you might want to blacklist the token
    # For now, we'll just return success since the client will clear cookies
    return {"message": "Logged out successfully"} 