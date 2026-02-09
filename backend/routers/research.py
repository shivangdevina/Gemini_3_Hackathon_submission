
from fastapi import APIRouter, HTTPException 
from uuid import UUID
from core.database import supabase


from pydantic import BaseModel , Field
from typing import Optional, List
from uuid import UUID



router = APIRouter(prefix="/research", tags=["research"])


class ResearchMember(BaseModel):
    user_id: UUID
    name: str
    task: List[str]
    pdf_url: Optional[str] = None


class ResearchOverviewResponse(BaseModel):
    project_id: UUID
    members: List[ResearchMember]


@router.get("/{project_id}/research-overview")
async def get_research_overview(project_id: UUID):


    research_res = { "members": [
    {
      "user_id": "8f3a2c41-6b2d-4d9b-9f6a-1c2e8a7b1234",
      "name": "Aaryan Sharma",
      "task": ["Literature Review", "Dataset Collection"],
      "pdf_url": ""
    },
    {
      "user_id": "b71d9f30-2e5a-4c11-8c44-6f9d2b8e5678",
      "name": "Priya Verma",
      "task": ["Model Training", "Hyperparameter Tuning"],
      "pdf_url": "https://res.cloudinary.com/demo/raw/upload/user_docs/priya_report.pdf"
    },
    {
      "user_id": "c2a7e8d9-5f44-4a22-b1a9-3d6e7f901234",
      "name": "Rohit Mehta",
      "task": ["Frontend UI", "API Integration"],
      "pdf_url": "https://res.cloudinary.com/demo/raw/upload/user_docs/rohit_design.pdf"
    }
  ]}
    return research_res


#exmaple response
'''{
    "project_id": "d3f0a629-b515-4553-a585-f234fe97914d",
    "member": [
        {
            "user_id": "e93113f2-96f4-4113-b98c-74a7919ac7fd",
            "name": "Aaryan Sharma",
            "task": [
                "Existing mental health apps analysis"
            ],
            "pdf_url": "https://cdn.com/alex.pdf"
        },
        {
            "user_id": "c2df6496-8586-4491-9dec-a15795c289cb",
            "name": "Unknown User",
            "task": [
                "NLP sentiment analysis techniques",
                "Model comparison study"
            ],
            "pdf_url": "https://cdn.com/sarah.pdf"
        },
        {
            "user_id": "bf70a59b-f22e-4943-9586-6b6338ae4e42",
            "name": "Unknown User",
            "task": [
                "Accessibility standards for mental health apps"
            ],
            "pdf_url": null
        }
    ]
}
'''


class ResearchTodoRequest(BaseModel):
    project_id: UUID = Field(..., description="ID of the project to generate research todos for")


