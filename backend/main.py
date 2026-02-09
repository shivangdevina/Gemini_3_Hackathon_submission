import datetime
from typing import Any, Dict, List, Optional
from fastapi import FastAPI , HTTPException , Query , status
from grpc import Status
from postgrest import APIError
from realtime import TypedDict 

from routers import auth , exploreApi , team , uploadPdf , research , project , profile
from uuid import UUID
from core.database import supabase
from pydantic import BaseModel, Field
import core.cloudinary
from fastapi.middleware.cors import CORSMiddleware


from notebooks.research_work import final_call
from notebooks.prd_to_todo import final_call_todo
from notebooks.ques_n_discussion import generate_combined_questions
from notebooks.copy_of_prd import run_prd_agent

app = FastAPI()



origins = [
    "http://localhost:3000",   
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://localhost:8081",   
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Which frontends can talk to backend
    allow_credentials=True,         # Allow cookies/auth headers
    allow_methods=["*"],            # Allow all HTTP methods
    allow_headers=["*"],            # Allow all headers
)

app.include_router(exploreApi.router)
app.include_router(team.router)
app.include_router(uploadPdf.router)
app.include_router(research.router)
app.include_router(project.router)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])

@app.get("/")
def root():
    return {"message": "Server running"}




class ProblemStatementRequest(BaseModel):
    problem_statement: str 
    project_id: UUID 
    


@app.post("/project/problem-statement")
def add_problem_statement(payload: ProblemStatementRequest):
    response = (
        supabase
        .from_("project_db")
        .update({"problem_statement": payload.problem_statement})
        .eq("id", str(payload.project_id))
        .execute()
    )


    

    

    return {
        "message": "Problem statement added successfully",
        "project_id": payload.project_id,
        "problem_statement": payload.problem_statement
    }




class IdeationStageRequest(BaseModel): #AI -copilot/project/ideation -answer type saved 
    project_id: UUID = Field(..., description="project_db.id")
    q_n_a: Optional[Dict[str, Any]] = Field(
        None,
        description="Question and Answer JSON structure"
    )
    prd: Optional[str] = Field(
        None,
        min_length=10,
        description="Product Requirement Document text"
    )

@app.post("/project/ideation-stage")
def upsert_ideation_stage(payload: IdeationStageRequest):
    response = (
        supabase
        .from_("ideation_stage")
        .upsert(
            {
                "project_id": str(payload.project_id),
                "q_n_a": payload.q_n_a,
                "prd": payload.prd,
            },
            on_conflict="project_id"
        )
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=500,
    
        )

    return {
        "message": "Ideation stage data saved successfully",
        "project_id": payload.project_id,
        "q_n_a": payload.q_n_a,
        "prd": payload.prd
    }



class UserProfileRequest(BaseModel):
    user_id: UUID = Field(..., description="Auth user ID")
    
@app.post("/user/profile")
def get_user_profile(payload: UserProfileRequest):
    response = (
        supabase
        .from_("user_profiles")
        .select("username, role, bio, avatar_url, skills")
        .eq("user_id", str(payload.user_id))
        .single()
        .execute()
    )

    

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail="User profile not found"
        )

    return response.data


class AddTeamMemberRequest(BaseModel):
    team_id: UUID = Field(..., description="Team ID")
    user_id: UUID = Field(..., description="User ID to add")

@app.post("/team/add-member")
def add_team_member(payload: AddTeamMemberRequest):
    # 1️⃣ Get current member list
    team_res = (
        supabase
        .from_("team_db")
        .select("team_members")
        .eq("team_id", str(payload.team_id))
        .single()
        .execute()
    )

    if not team_res.data:
        raise HTTPException(status_code=404, detail="Team not found")

    member_ids = team_res.data.get("team_members") or []

    
    if str(payload.user_id) not in member_ids:
        member_ids.append(str(payload.user_id))

   
    update_res = (
        supabase
        .from_("team_db")
        .update({"team_members": member_ids})
        .eq("team_id", str(payload.team_id))
        .execute()
    )

    if not update_res.data:
        raise HTTPException(status_code=500, detail="Failed to add member")

    return {
        "message": "User added to team successfully",
        "team_id": payload.team_id,
        "user_id": payload.user_id
    }  



class UserProfileCreateRequest(BaseModel):
    user_id: UUID

    full_name: Optional[str] = Field(None, max_length=100)
    username: str = Field(..., max_length=50)

    headline: Optional[str] = Field(None, max_length=150)
    bio: Optional[str]

    location: Optional[str]
    avatar_url: Optional[str]
    resume_url: Optional[str]

    availability: Optional[str] = "student"   # enum value

    role: Optional[Dict[str, Any]]             # jsonb
    skills: Optional[List[str]]                # text[]



@app.post("/user/profile/create")
def create_or_update_user_profile(payload: UserProfileCreateRequest):

    response = (
        supabase
        .from_("user_profiles")
        .upsert(
            {
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
            },
            on_conflict="user_id"
        )
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
            
        )

    return {
        "message": "User profile saved successfully",
        "user_id": payload.user_id
    }    





class UpdateQnARequest(BaseModel):
    project_id: UUID = Field(..., description="Project ID")
    q_n_a: Dict[str, Any] = Field(
        ...,
        description="Updated QnA JSON data"
    )

@app.post("/project/ideation/qna")
def update_qna(payload: UpdateQnARequest):

    response = (
        supabase
        .from_("ideation_stage")
        .upsert(
            {
                "project_id": str(payload.project_id),
                "q_n_a": payload.q_n_a
            },
            on_conflict="project_id"
        )
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
         
        )

    return {
        "message": "QnA updated successfully",
        "project_id": payload.project_id,
        "q_n_a": payload.q_n_a
    }


class QnAResponse(BaseModel):
    project_id: UUID
    q_n_a: Optional[Dict[str, Any]]





@app.get("/prd/{project_id}")
def get_prd(project_id: UUID):
    response = (
        supabase
        .table("ideation_stage")
        .select("prd")
        .eq("project_id", str(project_id))
        .single()
        .execute()
    )

    

    if not response.data:
        raise HTTPException(status_code=404, detail="PRD not found")
    #return response.data

    return {
       
        "prd": response.data["prd"]
    }



class QnAItem(BaseModel):
    question: str
    answer: str

class GeneratePRDRequest(BaseModel):
    project_id: UUID
    pitch: str
    qna: List[QnAItem]
@app.post("/prd/generate-prd")
def generate_prd(payload: GeneratePRDRequest):
    prd_text = "**hello"

    result = (
    supabase
    .table("ideation_stage")
    .upsert(
        {
            "project_id": str(payload.project_id),
            "pitch": payload.pitch,
            "q_n_a": [item.model_dump() for item in payload.qna],
            "prd": prd_text
        },
        on_conflict="project_id"
    )
    .execute()
)

    if result.data is None:
        raise HTTPException(status_code=500, detail="Failed to generate PRD")

    return {
        "prd": prd_text
    }


@app.get(
    "/project/{project_id}/team-members",
)
async def get_project_team_details(project_id: UUID):
    """
    Retrieves the complete team roster for a given project ID.
    Performs a relational lookup from Project -> Team -> User Profiles.
    """
    try:
        # 1. Retrieve team_id from project_db
        project_query = supabase.table("project_db") \
            .select("team_id") \
            .eq("id", str(project_id)) \
            .maybe_single() \
            .execute()

        if not project_query.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        team_id = project_query.data.get("team_id")

        # 2. Retrieve team_members (UUID array) from team_db
        team_query = supabase.table("team_db") \
            .select("team_members") \
            .eq("team_id", team_id) \
            .maybe_single() \
            .execute()

        if not team_query.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated team records not found"
            )

        member_ids = team_query.data.get("team_members", [])

        # Handle empty team scenario
        if not member_ids:
            return []

        # 3 & 4. Bulk Query user_profiles (Optimized from N+1 to 1 query)
        # We fetch all users where id is in the member_ids list
        user_query = supabase.table("user_profiles") \
            .select("user_id, full_name, role") \
            .in_("user_id", member_ids) \
            .execute()

        # 5. Collect and Format Results
        roster = []
        for user in user_query.data:
            role_data = user.get("role", {})
            
            # If role_data is a dict like {"student": 1}, extract the keys
            if isinstance(role_data, dict):
                # Joins keys if multiple exist (e.g., "student, developer") 
                # or just use next(iter(role_data)) if you only ever want one.
                role_value = ", ".join(role_data.keys()) 
            else:
                role_value = str(role_data)

            roster.append({
                "user_id": user["user_id"],
                "name": user["full_name"],
                "role": role_value
            })

        return roster

    except APIError as e:
        # Log the error here for internal observability
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connectivity error: {e.message}"
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected internal error occurred."
        )
    

class Person(TypedDict):
    name: str  # This will hold the string representation of the user_id UUID
    role: Dict[str, float]
    skills: List[str]

class TeamResponse(BaseModel):
    problem_statement: str
    team: List[Person]
    raw_topics: List[str]
    refined_topics: List[str]
    assignments: List[Dict[str, str]]

class PRDText(BaseModel):
    prd_text: str

class QnAItem(BaseModel):
    answer: str
    question: str

class FinalResponse(BaseModel):
    qna: List[QnAItem]
    pitch: str
class MemberOutput(BaseModel):
    user_id: str
    name: Optional[str] = None
    task: List[str]
    pdf_url: Optional[str] = None

class MockProject(BaseModel):
    project_name: str
    team_leader: str  # This must be a UUID string
    problem_statement: Optional[str] = "No statement provided"
    hackathon_name: Optional[str] = "Generic Hackathon"

class SearchQuery(BaseModel):
    query:str

# API ENDPOINT FOR RESEARCH TO-DO GENERATION 
# API ENDPOINT FOR RESEARCH TO-DO GENERATION 
@app.get("/research/{project_id}/todo", response_model=Dict[str, List[MemberOutput]])
async def get_team_members(project_id: UUID):
    try:
        # 1. Get team_id from project_db
        project_response = supabase.table("project_db") \
        .select("team_id") \
        .eq("id", str(project_id)) \
        .maybe_single() \
        .execute()
        
        if not project_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
            
        actual_team_id = project_response.data.get("team_id")

        # --- CACHE CHECK: If research tasks already exist, return them directly ---
        existing_research = supabase.table("research_stage") \
            .select("user_id, tasks, pdf_url") \
            .eq("project_id", str(project_id)) \
            .execute()

        if existing_research.data and any(row.get("tasks") for row in existing_research.data):
            # Fetch user profiles for names
            member_ids = [row["user_id"] for row in existing_research.data]
            user_response = supabase.table("user_profiles") \
                .select("user_id, full_name") \
                .in_("user_id", member_ids) \
                .execute()
            
            user_id_to_name = {str(profile["user_id"]): profile.get("full_name") for profile in user_response.data}
            
            members_list = []
            for row in existing_research.data:
                members_list.append(MemberOutput(
                    user_id=str(row["user_id"]),
                    name=user_id_to_name.get(str(row["user_id"])),
                    task=row.get("tasks") or [],
                    pdf_url=row.get("pdf_url")
                ))
            return {"members": members_list}
        # --- END CACHE CHECK ---

        # 2. Fetch team record to get the UUID array
        team_response = supabase.table("team_db") \
            .select("team_members") \
            .eq("team_id", str(actual_team_id)) \
            .maybe_single() \
            .execute()

        if not team_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        member_ids: List[str] = team_response.data.get("team_members", [])

        if not member_ids:
            return {"members": []}

        # 3. Fetch profiles using user_id instead of full_name
        user_response = supabase.table("user_profiles") \
            .select("user_id, full_name, role, skills") \
            .in_("user_id", member_ids) \
            .execute()

        profiles = user_response.data
        user_id_to_name = {str(profile["user_id"]): profile.get("full_name") for profile in profiles}

        
        ps = supabase.table("project_db") \
            .select("problem_statement") \
            .eq("team_id", str(actual_team_id)) \
            .order("created_at", desc=True) \
            .limit(1) \
            .execute()

        if not ps.data:
            raise HTTPException(
                status_code=404, 
                detail=f"No project found for team_id: {actual_team_id}"
            )

        # 3. Build response: Convert user_id UUID to string and map to 'name'
        result: List[Person] = [
            {
                "name": str(profile.get("user_id")),
                "role": profile.get("role", {}),
                "skills": profile.get("skills", [])
            }
            for profile in profiles
        ]
        
        answer = final_call(result, ps.data[0].get("problem_statement"))
        assignments = answer.get("assignments", [])
        
        grouped_data: Dict[str, List[str]] = {}
        
        for item in assignments:
            # item is a dict with keys: topic, assigned_to, justification
            uid = item.get("assigned_to")
            topic = item.get("topic")
            if uid:
                if uid not in grouped_data:
                    grouped_data[uid] = []
                grouped_data[uid].append(topic)

        # Build the response list
        members_list = []
        
        for user_id, tasks in grouped_data.items():
            
            member = MemberOutput(
                user_id=user_id,
                name=user_id_to_name.get(user_id),
                task=tasks,
                pdf_url=None
            )
            members_list.append(member)

        # Prepare data for research_stage insertion
        research_stage_data = []
        for member in members_list:
            research_stage_data.append({
                "project_id": str(project_id),
                "user_id": member.user_id,
                "tasks": member.task,
                "pdf_url": member.pdf_url
            })

        # Insert into research_stage table
        if research_stage_data:
             print(f"DEBUG: Inserting {len(research_stage_data)} rows into research_stage: {research_stage_data}")
             for entry in research_stage_data:
                 supabase.table("research_stage").upsert(entry).execute()

        return {"members": members_list}

    except HTTPException:
        raise
    except Exception as e:
        print(f"detail error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during data retrieval"
        )
    


@app.get("/ideation/qna/{project_id}", response_model=FinalResponse)
async def get_project_structure(project_id: UUID):
    try:
        # -------------------------------
        # STEP 1: CACHE CHECK (SAFE)
        # -------------------------------
        existing_ideation = supabase.table("ideation_stage") \
            .select("q_n_a, pitch") \
            .eq("project_id", str(project_id)) \
            .execute()

        if existing_ideation and existing_ideation.data:
            row = existing_ideation.data[0]
            if row.get("q_n_a"):
                return FinalResponse(
                    qna=[QnAItem(**item) for item in row["q_n_a"]],
                    pitch=row.get("pitch") or ""
                )

        # -------------------------------
        # STEP 2: FETCH PROBLEM STATEMENT
        # -------------------------------
        response = supabase.table("project_db") \
            .select("problem_statement") \
            .eq("id", str(project_id)) \
            .execute()

        if not response or not response.data:
            raise HTTPException(status_code=404, detail="Project ID not found")

        problem_statement = response.data[0].get("problem_statement")

        if not problem_statement:
            raise HTTPException(status_code=400, detail="Problem statement is empty or missing")

        # -------------------------------
        # STEP 3: CALL LLM
        # -------------------------------
        raw_llm_response = generate_combined_questions(problem_statement, "")

        if not raw_llm_response or not isinstance(raw_llm_response, list):
            raise HTTPException(status_code=500, detail="LLM returned invalid response")

        # -------------------------------
        # STEP 4: FORMAT QnA
        # -------------------------------
        formatted_qna = [
            QnAItem(
                question=item.get("question", ""),
                answer=""  # forced empty as required
            )
            for item in raw_llm_response
            if item.get("question")
        ]

        # -------------------------------
        # STEP 5: SAVE TO IDEATION STAGE
        # -------------------------------
        qna_json_data = [
            {"question": item.question, "answer": item.answer}
            for item in formatted_qna
        ]

        ideation_payload = {
            "project_id": str(project_id),
            "q_n_a": qna_json_data,
            "pitch": ""
        }

        supabase.table("ideation_stage").upsert(ideation_payload).execute()

        # -------------------------------
        # STEP 6: RETURN RESPONSE
        # -------------------------------
        return FinalResponse(
            qna=formatted_qna,
            pitch=""
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected Error in /ideation/qna: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

class CreateProjectRequest(BaseModel):
    user_id: UUID
    project_name: Optional[str]
    hackathon_id:Optional[Any]
    hackathon_name: Optional[str]
#deadline: Optional[datetime.datetime]
    description: Optional[str] = None

@app.post("/project/create")
async def create_project(payload: CreateProjectRequest):
    user_id = payload.user_id
    
   
        # 1️⃣ Insert into project_db
    project_res = supabase.table("project_db").insert({
            "project_name": "new project",
            "team_leader": str(user_id)
        }).execute()

    if not project_res.data:
            raise Exception("Project creation failed")

    project = project_res.data[0]
    project_id = project["id"]
    team_id = project["team_id"]

        # 2️⃣ Insert into user_projects
    user_project_res = supabase.table("user_projects").insert({
            "user_id": str(user_id),
            "project_id": project_id,
            "project_name": "new project",
            "current_status": "Manage Team",
            "state": "active"
        }).execute()

    if not user_project_res.data:
            raise Exception("User project mapping failed")

        # 3️⃣ Insert into team_db
    team_res = supabase.table("team_db").insert({
            "team_id": team_id,
            "project_id": project_id,
            "team_members": [str(user_id)],
            "team_leader": str(user_id),
            "team_name": "new project"
        }).execute()

    if not team_res.data:
            raise Exception("Team creation failed")

    return {
            "project_id": project_id,
            "team_id": team_id,
            "status": "project_created"
        }


@app.get("/project/{project_id}/problem-statement")
def get_problem_statement(project_id: UUID):
    response = (
        supabase
        .table("project_db")
        .select("problem_statement")
        .eq("id", str(project_id))
        .maybe_single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return {
        "problem_statement": response.data.get("problem_statement") or ""
    }


#API ENDPOINT FOR CREATE PRD FROM QNA , PS , PITCH
@app.get("/prd/generate-prd/{project_id}")
async def create_prd(project_id: UUID):
    try:
        # --- CACHE CHECK ---
        # Fetch existing ideation data (including pitch, qna, and prd for optimization)
        ideation_res = supabase.table("ideation_stage")\
            .select("pitch, q_n_a, prd")\
            .eq("project_id", str(project_id))\
            .maybe_single()\
            .execute()

        # If PRD already exists, return it directly
        if ideation_res.data and ideation_res.data.get("prd"):
            return {"prd": ideation_res.data.get("prd")}
        # --- END CACHE CHECK ---

        # 1. Fetch Problem Statement from 'project_db'
        # We need this because it is not in the 'ideation_stage' schema
        project_res = supabase.table("project_db")\
            .select("problem_statement")\
            .eq("id", str(project_id))\
            .execute()

        if not project_res.data:
            raise HTTPException(status_code=404, detail="Project ID not found in project_db")
        
        problem_statement = project_res.data[0].get("problem_statement")

        # 2. Extract Pitch and QnA from the earlier fetch or default
        pitch_val = None
        qna_val = []

        if ideation_res.data:
            pitch_val = ideation_res.data.get("pitch")
            qna_val = ideation_res.data.get("q_n_a")
        
        response = run_prd_agent(problem_statement, pitch_val or "", qna_val or [])
        
        prd_text = response 

        if ideation_res.data:
            # SCENARIO A: Row exists. 
            # We strictly UPDATE only the 'prd' column to preserve existing pitch/qna.
            save_res = supabase.table("ideation_stage")\
                .update({"prd": prd_text})\
                .eq("project_id", str(project_id))\
                .execute()
        else:
            # SCENARIO B: Row does not exist.
            # We INSERT a new row with the project_id and the prd.
            save_res = supabase.table("ideation_stage")\
                .insert({
                    "project_id": str(project_id), 
                    "prd": prd_text
                })\
                .execute()

        # 4. Return the result
        return {
            "prd": prd_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))