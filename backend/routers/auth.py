from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import hashlib
from core.database import supabase

router = APIRouter()

# -------------------------
# Password hashing
# -------------------------
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()



# -------------------------
# Request Schemas
# -------------------------
class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -------------------------
# Signup API
# -------------------------
@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest):
    try:
        response = supabase.table("users").insert({
            "email": payload.email,
            "password": hash_password(payload.password)
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="User creation failed")

        user_id = response.data[0]["id"]

        return {
            "message": "Signup successful",
            "user_id": user_id
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# -------------------------
# Login API
# -------------------------
@router.post("/login", status_code=status.HTTP_200_OK)
def login(payload: LoginRequest):
    try:
        hashed_password = hash_password(payload.password)

        response = supabase.table("users").select("*").eq("email", payload.email).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user = response.data[0]

        if user["password"] != hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        return {
            "message": "Login successful",
            "user_id": user["id"],
            "email": user["email"],
            "role": user["role"]
        }

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )