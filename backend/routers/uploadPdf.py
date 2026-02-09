from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary.uploader
import core.cloudinary
from core.database import supabase

router = APIRouter(prefix="/uploadPdf", tags=["uploadPdf"])

fake_db = {} 

@router.post("/upload/{project_id}/{user_id}")
async def upload_pdf(project_id: str, user_id: str, file: UploadFile = File(...)):
    
    # 1️⃣ Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    # 2️⃣ Upload to Cloudinary
    try:
        result = cloudinary.uploader.upload(
            file.file,
            resource_type="raw",
            format="pdf",
            public_id=f"user_docs/{user_id}_{project_id}_research",
            overwrite=True,
            access_mode="public"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    pdf_url = result.get("secure_url")

    # 3️⃣ Store URL in research_stage table
    try:
        response = supabase.table("research_stage").upsert(
            {
                "project_id": project_id,
                "user_id": user_id,
                "pdf_url": pdf_url
            },
            on_conflict="project_id,user_id"  # because it's a composite PK
        ).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB update failed: {str(e)}")

    return {
        "message": "PDF uploaded & research stage updated successfully",
        "pdf_url": pdf_url}


@router.get("/view/{project_id}/{user_id}")
async def view_pdf(project_id: str, user_id: str):

    try:
        response = (
            supabase.table("research_stage")
            .select("pdf_url")
            .eq("project_id", project_id)
            .eq("user_id", user_id)
            .execute()
        )

        data = response.data

        if not data or data[0].get("pdf_url") is None:
            return {
                "exists": False,
                "message": "No PDF uploaded for this project research stage yet."
            }

        return {
            "exists": True,
            "pdf_url": data[0]["pdf_url"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB fetch failed: {str(e)}")