from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math

router = APIRouter(prefix="/exploreApi", tags=["exploreApi"])


# Data Model for the Request Payload
class SearchFilters(BaseModel):
    query: str
    filters: str  # Comma-separated string as requested

class SearchRequest(BaseModel):
    query: str
    filters: Optional[str] = ""
    page: int = 1
    limit: int = 10

# Mock Data (Matches the structure in Explore.tsx)
HACKATHONS = [
    {
        "id": 1,
        "name": "AI Innovation Challenge 2026",
        "platform": "Devpost",
        "deadline": "Feb 15, 2026",
        "description": "Build the next generation of AI-powered solutions that transform industries and improve lives.",
        "mode": "Online",
        "participants": 1250,
        "prize": "$50,000",
        "tags": ["AI/ML", "Healthcare", "Beginner Friendly"],
        "featured": True,
        "daysLeft": 13,
    },
    {
        "id": 2,
        "name": "Web3 Hackathon",
        "platform": "ETHGlobal",
        "deadline": "Feb 20, 2026",
        "description": "Create decentralized applications that push the boundaries of blockchain technology.",
        "mode": "Hybrid",
        "participants": 890,
        "prize": "$100,000",
        "tags": ["Blockchain", "DeFi", "NFTs"],
        "featured": True,
        "daysLeft": 18,
    },
    # ... more hackathon objects
]

@router.post("/api/hackathons/search")
async def search_hackathons(request: SearchRequest):
    filtered_data = HACKATHONS
    
    # 1. Logic for Keyword Search
    if request.query:
        query_lower = request.query.lower()
        filtered_data = [
            h for h in filtered_data 
            if query_lower in h["name"].lower() or query_lower in h["description"].lower()
        ]

    # 2. Logic for Filters (Comma separated list)
    if request.filters:
        filter_list = [f.strip().lower() for f in request.filters.split(",") if f.strip()]
        if filter_list:
            final_filtered = []
            for h in filtered_data:
                # Check if any filter matches platform, mode, or tags
                match_platform = h["platform"].lower() in filter_list
                match_mode = h["mode"].lower() in filter_list
                match_tags = any(tag.lower() in filter_list for tag in h["tags"])
                
                if match_platform or match_mode or match_tags:
                    final_filtered.append(h)
            filtered_data = final_filtered

    # 3. Pagination Logic
    total_count = len(filtered_data)
    start_idx = (request.page - 1) * request.limit
    end_idx = start_idx + request.limit
    paginated_data = filtered_data[start_idx:end_idx]
    
    total_pages = math.ceil(total_count / request.limit)

    return {
        "data": paginated_data,
        "pagination": {
            "total": total_count,
            "page": request.page,
            "limit": request.limit,
            "totalPages": total_pages,
            "hasMore": request.page < total_pages
        }
    }



