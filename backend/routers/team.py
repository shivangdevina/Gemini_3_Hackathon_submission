from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from uuid import UUID
import os
from core.database import supabase

# Define the schema with UUID types
class CreateTeam(BaseModel):
    user_id: UUID
    team_name: str
    project_id: UUID
    team_leader: UUID
    team_members: List[UUID]

router = APIRouter(prefix="/team", tags=["team"])

@router.post("/createTeam")
async def create(request: CreateTeam):
    team_name="hero_team"
    if(request.team_name):
        team_name=request.team_name
    
    try:
        response = supabase.table("team_db").insert({
            "team_name": team_name,
            "project_id": str(request.project_id),
            "team_leader": str(request.user_id),
            "team_members": [str(member_id) for member_id in request.team_members]
        }).execute()

        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create team")

        return {
            "message": "Team created successfully",
            "team": response.data[0]
        }
    except Exception as e:
       
        raise HTTPException(status_code=500, detail=str(e))