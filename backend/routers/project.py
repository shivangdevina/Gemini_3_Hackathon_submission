
from fastapi import APIRouter, HTTPException , Query , Body
from uuid import UUID
from core.database import supabase


from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from enum import IntEnum

class ProjectStage(IntEnum):
    MANAGE_TEAM = 1
    RESEARCH = 2
    IDEATION = 3
    PRD = 4
    IMPLEMENTATION = 5


STAGE_LABELS = {
    ProjectStage.MANAGE_TEAM: "Manage Team",
    ProjectStage.RESEARCH: "Research",
    ProjectStage.IDEATION: "Ideation",
    ProjectStage.PRD: "PRD",
    ProjectStage.IMPLEMENTATION: "Implementation",
}
router = APIRouter(prefix="/project", tags=["project"])

@router.get("/user-projects")
def get_user_projects(query: UUID = Query(...)):
    response = (
        supabase
        .from_("user_projects")
        .select("project_id, project_name, hackathon_name, current_status")
        .eq("user_id", str(query))
        .execute()
    )


    formatted_projects = []

    stage_labels = {
      "Manage Team":1,
      "Research":2,
        "Ideation":3,
      "PRD":4,
        "Implementation":5,
    }
    
    for project in response.data:
        print("hello. ")
        print(stage_labels.get(project["current_status"]))

        formatted_projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "hackathon_name": project["hackathon_name"],
            "current_status": project["current_status"],  # keep number
            "stage_label": stage_labels.get(project["current_status"]),  # 👈 added field
        })

    return {"projects": formatted_projects}


class UpdateStageRequest(BaseModel):
    project_id: UUID
    stage: ProjectStage  
@router.patch("/stage")
def update_project_stage(data: UpdateStageRequest):
    stage_label = STAGE_LABELS[data.stage]  # number → string

    supabase.table("user_projects") \
        .update({"current_status": stage_label}) \
        .eq("project_id", data.project_id) \
        .execute()

    return {
        "message": "Stage updated",
        "project_id": data.project_id,
        "stage_number": int(data.stage),
        "stage_label": stage_label
    }