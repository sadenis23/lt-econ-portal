from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
import json
from datetime import datetime

from ..db import get_session
from ..models import Profile, Topic, ProfileTopic, User, StakeholderRole, DigestFrequency, Language
from ..auth import get_current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/me")
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get current user's profile"""
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Get user's topics
    profile_topics = session.exec(
        select(ProfileTopic).where(ProfileTopic.profile_id == profile.id)
    ).all()
    
    topic_slugs = [pt.topic_slug for pt in profile_topics]
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "role": profile.role,
        "language": profile.language,
        "newsletter": profile.newsletter,
        "digest_frequency": profile.digest_frequency,
        "onboarding_completed": profile.onboarding_completed,
        "topic_slugs": topic_slugs,
        "created_at": profile.created_at,
        "updated_at": profile.updated_at
    }

@router.patch("/me")
async def update_my_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update current user's profile"""
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    if not profile:
        # Create new profile if it doesn't exist
        profile = Profile(user_id=current_user.id)
        session.add(profile)
    
    # Update profile fields
    if "role" in profile_data:
        try:
            profile.role = StakeholderRole(profile_data["role"])
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role"
            )
    
    if "language" in profile_data:
        try:
            profile.language = Language(profile_data["language"])
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid language"
            )
    
    if "newsletter" in profile_data:
        profile.newsletter = profile_data["newsletter"]
    
    if "digest_frequency" in profile_data:
        digest_freq = profile_data["digest_frequency"]
        if digest_freq:  # Only set if not empty
            try:
                profile.digest_frequency = DigestFrequency(digest_freq)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid digest frequency"
                )
        # If digest_freq is empty, keep the current value (don't change it)
    
    if "onboarding_completed" in profile_data:
        profile.onboarding_completed = profile_data["onboarding_completed"]
    
    profile.updated_at = datetime.utcnow()
    
    # Handle topics if provided
    if "topic_slugs" in profile_data:
        # Remove existing topics
        existing_topics = session.exec(
            select(ProfileTopic).where(ProfileTopic.profile_id == profile.id)
        ).all()
        for topic in existing_topics:
            session.delete(topic)
        
        # Add new topics
        for slug in profile_data["topic_slugs"]:
            # Verify topic exists
            topic = session.exec(select(Topic).where(Topic.slug == slug)).first()
            if not topic:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Topic with slug '{slug}' not found"
                )
            
            profile_topic = ProfileTopic(profile_id=profile.id, topic_slug=slug)
            session.add(profile_topic)
    
    session.commit()
    session.refresh(profile)
    
    return {"message": "Profile updated successfully"}

@router.get("/topics")
async def get_topics(
    session: Session = Depends(get_session),
    lang: str = "lt"
):
    """Get all available topics"""
    topics = session.exec(select(Topic)).all()
    
    return [
        {
            "slug": topic.slug,
            "name": topic.name_lt if lang == "lt" else topic.name_en,
            "description": topic.description_lt if lang == "lt" else topic.description_en,
            "icon": topic.icon
        }
        for topic in topics
    ]

@router.get("/roles")
async def get_roles():
    """Get all available stakeholder roles"""
    return [
        {
            "value": role.value,
            "label": {
                "lt": {
                    "policy_maker": "Politikos formuotojas",
                    "journalist": "Žurnalistas",
                    "academic": "Mokslininkas",
                    "business": "Verslininkas",
                    "ngo": "NVO atstovas",
                    "student": "Studentas",
                    "citizen": "Pilietis"
                },
                "en": {
                    "policy_maker": "Policy Maker",
                    "journalist": "Journalist",
                    "academic": "Academic",
                    "business": "Business",
                    "ngo": "NGO Representative",
                    "student": "Student",
                    "citizen": "Citizen"
                }
            }
        }
        for role in StakeholderRole
    ]

@router.get("/recommendations")
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get personalized dashboard recommendations based on user interests"""
    profile = session.exec(
        select(Profile).where(Profile.user_id == current_user.id)
    ).first()
    
    if not profile or not profile.onboarding_completed:
        # Return default dashboards if no profile or onboarding not completed
        dashboards = session.exec(select(Dashboard).limit(6)).all()
        return [
            {
                "id": dashboard.id,
                "title": dashboard.title,
                "description": dashboard.description,
                "tags": json.loads(dashboard.tags) if dashboard.tags else [],
                "score": 0.0
            }
            for dashboard in dashboards
        ]
    
    # Get user's topics
    profile_topics = session.exec(
        select(ProfileTopic).where(ProfileTopic.profile_id == profile.id)
    ).all()
    
    user_topic_slugs = {pt.topic_slug for pt in profile_topics}
    
    # Get all dashboards
    dashboards = session.exec(select(Dashboard)).all()
    
    # Calculate recommendation scores
    recommendations = []
    for dashboard in dashboards:
        dashboard_tags = json.loads(dashboard.tags) if dashboard.tags else []
        
        # Simple TF-IDF inspired scoring
        matching_topics = len(set(dashboard_tags) & user_topic_slugs)
        total_user_topics = len(user_topic_slugs)
        
        if total_user_topics > 0:
            score = matching_topics / total_user_topics
        else:
            score = 0.0
        
        recommendations.append({
            "id": dashboard.id,
            "title": dashboard.title,
            "description": dashboard.description,
            "tags": dashboard_tags,
            "score": score
        })
    
    # Sort by score (highest first)
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    
    return recommendations[:6]  # Return top 6 recommendations 