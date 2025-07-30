from datetime import datetime
from sqlmodel import SQLModel, Field
from typing import Optional, List
from enum import Enum

class StakeholderRole(str, Enum):
    POLICY_MAKER = "policy_maker"
    JOURNALIST = "journalist"
    ACADEMIC = "academic"
    BUSINESS = "business"
    NGO = "ngo"
    STUDENT = "student"
    CITIZEN = "citizen"

class DigestFrequency(str, Enum):
    NEVER = "never"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Language(str, Enum):
    LT = "lt"
    EN = "en"

class EconomicReport(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    date: str

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    role: Optional[StakeholderRole] = None
    language: Language = Field(default=Language.LT)
    newsletter: bool = Field(default=True)
    digest_frequency: DigestFrequency = Field(default=DigestFrequency.WEEKLY)
    onboarding_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name_lt: str
    name_en: str
    description_lt: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileTopic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    profile_id: int = Field(foreign_key="profile.id")
    topic_slug: str = Field(foreign_key="topic.slug")

class Dataset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    source_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Dashboard(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None  # JSON string of tags
    created_at: datetime = Field(default_factory=datetime.utcnow) 