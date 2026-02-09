from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from uuid import UUID

from core.database import supabase

router = APIRouter()

# =========================
# Schema (Pydantic)
# =========================
class UserProfileCreate(BaseModel):
    user_id: UUID
    full_name: Optional[str] = Field(None, max_length=100)
    username: str = Field(..., max_length=50)
    headline: Optional[str] = Field(None, max_length=150)
    bio: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    availability: Optional[str] = "student"
    role: Optional[Dict] = None
    skills: Optional[List[str]] = None


# =========================
# Create User Profile API
# =========================
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user_profile(payload: UserProfileCreate):
    try:
        supabase.table("user_profiles").insert({
            "user_id": str(payload.user_id),
            "full_name": payload.full_name,
            "username": payload.username,
            "headline": payload.headline,
            "bio": payload.bio,
            "location": payload.location,
            "avatar_url": payload.avatar_url,
            "resume_url": payload.resume_url,
            "availability": payload.availability,
            "role": payload.role,
            "skills": payload.skills,
        }).execute()

        return {
            "message": "User profile created successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )