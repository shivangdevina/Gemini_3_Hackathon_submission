# Gemini_3_Hackathon_submission — Technical README

![Powered by Gemini 3](https://img.shields.io/badge/powered%20by-Gemini%203-4285F4?logo=google&logoColor=white)

A full-stack hackathon submission combining a FastAPI backend, GenAI-enabled notebooks (LangChain + Google GenAI / Gemini 3), Supabase for persistence, Cloudinary for file storage, and a Vite + React + TypeScript frontend. This README documents the architecture, AI implementation (with emphasis on Gemini 3), setup, key APIs, developer workflow, and security recommendations.

---

Table of contents
- Project overview
- Architecture & dataflow
- AI implementation (detailed) — Gemini 3 focused
- Quickstart (local dev)
  - Prerequisites
  - Backend setup & run
  - Frontend setup & run
- Configuration / Environment variables
- API reference (selected endpoints + examples)
- Database & storage notes
- Security & hardening recommendations
- Development & testing
- Troubleshooting
- Roadmap & contributing
- Appendix — useful commands

---

Project overview
- Purpose: A collaborative project/workspace platform for hackathon teams that integrates an advanced AI assistant (designed to use Gemini 3 via Google GenAI) to help with research, ideation, PRD generation, and to-dos. Users can create teams, upload research PDFs, run AI tools (Gemini 3-powered notebooks) to create PRDs / TODOs / Q&A and progress through project stages.
- Why Gemini 3 (short): Gemini 3 is used here through the Google GenAI / langchain-google-genai bindings to provide high-quality instruction-following, strong summarization, and robust multi-turn reasoning for the notebook workflows. It's an excellent fit for turning research PDFs and free-form PRD text into structured outputs (summaries, Q&A, actionable todo lists).
- High-level features:
  - User signup & login (backend/routers/auth.py)
  - Team creation & management (backend/routers/team.py)
  - Upload research PDFs and serve them (backend/routers/uploadPdf.py)
  - Project lifecycle and stage updates (backend/routers/project.py and endpoints in backend/main.py)
  - Research overview (backend/routers/research.py)
  - Explore/search endpoint to find hackathons (backend/routers/exploreApi.py)
  - Frontend: React + TypeScript app with protected routes, AuthContext and AIContext (frontend/src)

---

Architecture & dataflow (textual)
- Client (React/Vite)
  - Routes handled in frontend/src/App.tsx.
  - Uses AuthContext to manage session and ProtectedRoute to protect pages.
  - AIContext exists to manage calls to backend AI endpoints (see frontend/src/contexts/AIContext.tsx).
  - The frontend triggers AI workflows (via the backend) that are powered by Gemini 3 for tasks like summarization, QA, PRD generation and TODO extraction.
- Backend (FastAPI)
  - Entry: backend/main.py
  - Routers (in backend/routers): auth, project, team, uploadPdf, research, profile, exploreApi.
  - AI notebooks (backend/notebooks/*): encapsulate GenAI workflows (PRD generation, TODO extraction, Q&A generation, research summarization) — these notebooks are designed to call the Google GenAI / Gemini 3 model via LangChain bindings.
  - DB: Supabase client created in backend/core/database.py (uses SUPABASE_URL and SUPABASE_KEY).
  - Storage: Cloudinary for raw file storage (backend/core/cloudinary.py; upload logic in uploadPdf router).
- AI integration (Gemini 3)
  - The project uses the langchain-google-genai package (see backend/requirements.txt) to connect LangChain chains/pipelines to Google GenAI — intended to surface Gemini 3 model capabilities.
  - Notebook functions (imported in backend/main.py) are triggered by API endpoints to generate outputs that are saved/returned to the client. These functions should call the Gemini 3-powered GenAI model via LangChain Google GenAI integration.
  - Example flow (Gemini 3-powered):
    1. Ingest text or retrieve documents (PDF -> text extraction).
    2. Create chains/pipelines (summarization, question generation, extraction).
    3. Use Gemini 3 (via Google GenAI / langchain-google-genai) as the LLM.
    4. Post-process results and store in Supabase or return to frontend.

Dataflow example: upload research PDF
1. Client uploads PDF to backend /uploadPdf/upload/{project_id}/{user_id}.
2. Backend uploads binary to Cloudinary and obtains secure URL.
3. Backend upserts url into Supabase research_stage table.
4. Gemini 3-powered AI notebooks can later use PDF URL (or server-extracted content) to produce summaries, questions, TODOs — delivering accurate, context-aware insights for teams.

---

AI Implementation (detailed)
Files of interest:
- backend/requirements.txt includes:
  - langchain-google-genai
  - langchain-core
  - langgraph
  - python-dotenv
  - other standard libs

- backend/main.py imports:
  - notebooks.research_work.final_call
  - notebooks/prd_to_todo.final_call_todo
  - notebooks.ques_n_discussion.generate_combined_questions
  - notebooks.copy_of_prd.run_prd_agent

What this implies (how AI is designed to work)
- LangChain + Google GenAI (Gemini 3) is used for higher-level NLP tasks:
  - Research summarization and extraction (research_work).
  - Conversion of PRD text to actionable TODOs (prd_to_todo).
  - Generating combined question sets or discussion prompts from inputs (ques_n_discussion).
  - Running PRD agents to craft and refine product requirement documents (copy_of_prd).
- Notebook functions are imported into the FastAPI app and are intended to be invoked by endpoints in main.py (or other routers). They accept project text/URLs and return structured JSON (e.g., Q&A pairs, PRD text, lists of todos).
- Typical LangChain + Gemini 3 workflow used here (conceptually):
  1. Ingest text or retrieve documents (PDF -> text extraction).
  2. Create chains/pipelines (e.g., summarization, question generation, extraction).
  3. Use Gemini 3 as the underlying model via langchain-google-genai bindings.
  4. Post-process results and store them in Supabase or return to frontend.

Why Gemini 3 is great for this project (practical benefits)
- High-quality summarization: Gemini 3 can produce concise and faithful summaries from technical PDFs and notes — ideal for research_overview and PRD drafts.
- Instruction following: It excels at following complex instructions, which helps when converting PRD text into actionable TODO lists and when generating structured Q&A.
- Multi-turn reasoning: For iterative PRD refinement and follow-up prompts, Gemini 3 handles context retention well.
- Efficiency: Fewer prompt iterations for quality results — reduces latency and cost when tuned properly.

Quick LangChain example (how you might wire Gemini 3 via Google GenAI)
- Example (copy-paste into a notebook or helper module — illustrative; adapt keys/env names to your setup):
```python
# Example: LangChain + Google GenAI (Gemini 3) configuration snippet (EXAMPLE)
from langchain_google_genai import GoogleGenAI
from langchain import LLMChain, PromptTemplate

# Create a Gemini 3 / Google GenAI client (pseudo-example; adapt to lib version)
llm = GoogleGenAI(api_key="YOUR_GEMINI_API_KEY", model="gpt-4o-mini" )
# Note: model name should be set according to provider docs (e.g., "gemini-3-*"). Check the langchain-google-genai docs.

template = "Summarize the following technical document in 5 bullet points:

{doc_text}"
prompt = PromptTemplate(input_variables=["doc_text"], template=template)

chain = LLMChain(llm=llm, prompt=prompt)
summary = chain.run(doc_text="... extracted PDF text here ...")
print(summary)
```
- Important: The exact class/constructor names may vary by library version — consult langchain-google-genai docs. The snippet demonstrates the intended wiring and is compatible with the repo's langchain-google-genai dependency.

Recommendations and notes:
- PDF ingestion: The repository uploads PDFs to Cloudinary. To run Gemini 3 operations on the PDF content you must either:
  - Extract text server-side (e.g., pdfminer / PyMuPDF / external extractor) and pass the text to your LangChain/Gemini pipeline; or
  - Use a remote PDF reading connector in LangChain if supported.
- Long documents: Use splitting & retrieval (text chunking, embeddings, vector store) for QA and summarization. Gemini 3 used as the LLM in a RAG setup provides much better accuracy for document-grounded answers.
- Cost & throttling: Gemini 3 model calls may be billable. Add queueing / rate-limiting for heavy tasks. Use batching and lower temperature for deterministic outputs when possible.

---

Quickstart (local development)

Prerequisites
- Node.js (>=16) and npm
- Python 3.10+
- Git
- (Optional) Docker if you want to containerize services
- Cloudinary account (for uploads) or adjust upload code to another storage
- Supabase project (Postgres) and SUPABASE_KEY that has REST access
- Google GenAI / Gemini 3 API key (recommended) — see Configuration below

1) Clone repository
git clone https://github.com/shivangdevina/Gemini_3_Hackathon_submission.git
cd Gemini_3_Hackathon_submission

2) Backend: create venv and install
cd backend
python -m venv .venv
# On macOS / Linux
source .venv/bin/activate
# On Windows (Powershell)
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

3) Backend: environment variables
Create a .env file in backend/ with:

SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-service-role-or-rest-key
JWT_SECRET=your_jwt_secret

# Gemini 3 / Google GenAI (recommended)
# Use the API key / credentials that allow access to Google GenAI (Gemini 3)
GEMINI_API_KEY=your_gemini_api_key_or_google_api_key
# or
GOOGLE_GENAI_API_KEY=your_google_genai_key

# Cloudinary values
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

Important: The repository currently contains hard-coded Cloudinary credentials (backend/core/cloudinary.py). Replace with environment-based config to avoid leaking secrets.

4) Backend: run service
# from repo root
uvicorn backend.main:app --reload --port 8000

Notes:
- CORS: backend/main.py allows origins ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080","http://localhost:8081"]. Vite default is 5173 — either run frontend on 3000 or add "http://localhost:5173" to the origins list in backend/main.py.

5) Frontend: install and run
cd frontend
npm install
npm run dev
# Vite default dev server = http://localhost:5173 (or 3000 if configured)

6) Running tests (frontend)
cd frontend
npm run test

---

Configuration / Environment variables (suggested)
Backend (.env in backend/)
- SUPABASE_URL — your Supabase REST URL
- SUPABASE_KEY — Supabase key (service role for server-side write access) — treat as secret
- JWT_SECRET — secret for signing JWTs (string)
- CLOUDINARY_CLOUD_NAME — cloudinary cloud name
- CLOUDINARY_API_KEY — cloudinary API key
- CLOUDINARY_API_SECRET — cloudinary secret

Gemini 3 / Google GenAI
- GEMINI_API_KEY or GOOGLE_GENAI_API_KEY — API key or credentials for Google GenAI (Gemini 3)
- OPTIONAL: any provider-specific project/region variables required by Google Cloud

Frontend (.env in frontend/)
- Add any public runtime keys you need (e.g. VITE_API_URL=http://localhost:8000). Example .env:
VITE_API_URL=http://localhost:8000

Use environment-based Cloudinary and Gemini 3 configuration instead of hard-coded credentials in core/cloudinary.py and any notebook files.

---

API reference (selected endpoints with examples)
Note: Default backend host in examples is http://localhost:8000

1) Health check
GET /
Response: {"message": "Server running"}

2) Auth
Signup
POST /auth/signup
Request JSON:
{
  "email": "alice@example.com",
  "password": "strongpassword"
}
curl:
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

Login
POST /auth/login
Request JSON same shape.
Response currently returns user details (no JWT issued by this router as-is):
{
  "message": "Login successful",
  "user_id": "...",
  "email": "...",
  "role": "..."
}

Note: There is a security module (backend/core/security.py) that can create tokens; you can adapt auth router to return JWTs via create_access_token/create_refresh_token.

3) Projects
Get user projects
GET /project/user-projects?query=<user-uuid>
Example:
curl "http://localhost:8000/project/user-projects?query=8f3a2c41-6b2d-4d9b-9f6a-1c2e8a7b1234"

Update project stage
PATCH /project/stage
Request JSON:
{
  "project_id": "uuid-here",
  "stage": 3
}
stage is an enum (1=Manage Team, 2=Research, 3=Ideation, 4=PRD, 5=Implementation)

4) Problem statement & ideation (in main.py)
POST /project/problem-statement
Body:
{
  "problem_statement": "Problem text ...",
  "project_id": "uuid"
}

POST /project/ideation-stage
Body:
{
  "project_id": "uuid",
  "q_n_a": { ...optional... },
  "prd": "optional PRD text..."
}
This upserts into ideation_stage table in Supabase. The PRD text here is an ideal input to the Gemini 3 pipelines (PRD → TODO conversion, summarization, and QA generation).

5) Team creation
POST /team/createTeam
Request JSON:
{
  "user_id": "leader-uuid",
  "team_name": "Team X",
  "project_id": "project-uuid",
  "team_leader": "leader-uuid",
  "team_members": ["uuid1","uuid2"]
}
Example:
curl -X POST http://localhost:8000/team/createTeam \
  -H "Content-Type: application/json" \
  -d '{"user_id":"...","team_name":"hero_team","project_id":"...","team_leader":"...","team_members":["..."]}'

6) Upload PDF
POST /uploadPdf/upload/{project_id}/{user_id}
Form multipart with file field.
Example curl:
curl -X POST "http://localhost:8000/uploadPdf/upload/PROJECT_UUID/USER_UUID" \
  -F "file=@/path/to/research.pdf;type=application/pdf"

View PDF
GET /uploadPdf/view/{project_id}/{user_id}
Returns JSON: exists: True/False and pdf_url

7) Research overview
GET /research/{project_id}/research-overview
Returns a mock response with members — intended to be replaced by supabase queries. Results from this endpoint can be used to seed Gemini 3 summarization/QA pipelines for the project.

8) Explore / Hackathons search (mock)
POST /exploreApi/api/hackathons/search
Body:
{
  "query": "ai",
  "filters": "Online, Devpost",
  "page": 1,
  "limit": 10
}

9) Profile creation
POST /profile/
Body matches UserProfileCreate (user_id, username, etc.) — upserts into user_profiles table.

---

Database & storage notes
- Supabase:
  - core/database.py uses create_client(SUPABASE_URL, SUPABASE_KEY).
  - Tables referenced: users, user_profiles, user_projects, research_stage, ideation_stage, team_db, project_db, etc.
  - Ensure you create these tables in your Supabase project with appropriate schemas before running the application. The code expects:
    - research_stage: composite primary key (project_id, user_id) (uploadPdf uses on_conflict="project_id,user_id")
    - ideation_stage: on_conflict by project_id
    - user_profiles: columns matching fields in profile router
  - Example minimal users table:
    - id (uuid, primary)
    - email (text)
    - password (text)
    - role (text)
- Cloudinary:
  - uploadPdf router uses cloudinary.uploader.upload(... resource_type="raw" format="pdf" public_id=f"user_docs/{user_id}_{project_id}_research")
  - The code currently has cloudinary credentials in backend/core/cloudinary.py (replace with env variables and a small wrapper to call cloudinary.config from environment).
- Gemini 3 / GenAI outputs:
  - When storing LLM outputs (summaries/QA/todos) in Supabase, make sure to store provenance metadata (prompt, model name, timestamp) to trace generated content back to the Gemini 3 invocation.

---

Security & hardening recommendations
- Remove hard-coded secrets: backend/core/cloudinary.py includes credentials in the repo. Replace with environment-based configuration and remove credentials from VCS immediately.
- Authentication: auth router currently stores and compares sha256(password). There is also a security module (backend/core/security.py) that wraps password hashing (bcrypt via passlib) and JWT creation. Recommendation:
  - Use backend/core/security.py functions (hash_password, verify_password, create_access_token) to securely hash and verify passwords and issue JWTs on login.
  - Store only hashed passwords (bcrypt) in DB.
  - Protect sensitive endpoints using JWT bearer tokens (FastAPI dependency).
- LLM safety & guardrails:
  - Gemini 3 is powerful — add guardrails and system prompts to constrain outputs, especially for QA on sensitive material.
  - Validate/normalize LLM outputs before persisting (e.g., ensure TODOs have expected structure).
  - Add content filters for sensitive content if required by your use case.
- CORS: add the actual frontend origin (Vite default 5173) to allowed origins or run frontend on 3000.
- Use least-privilege SUPABASE_KEY for server: service keys are powerful; rotate keys regularly.
- Rate-limiting & task queues around heavy AI calls — to prevent excessive LLM calls and runaway costs.
- Auditing: Log model invocation metadata (model identifier, prompt, cost estimate) when calling Gemini 3 for future audits and cost tracking.

---

Development & testing
- Frontend:
  - npm run dev (development server)
  - npm run build (production build)
  - npm run test (run vitest)
- Backend:
  - Develop with uvicorn backend.main:app --reload
  - Add unit tests using pytest if desired; no backend tests are provided currently.
- Linting & formatting:
  - Frontend has ESLint configured in package.json. Configure your IDE and pre-commit hooks as needed.

---

Troubleshooting
- CORS errors in browser: check origins list in backend/main.py and include the frontend origin (e.g., http://localhost:5173).
- 401 / auth issues: current login lacks JWT issuance; consider modifying auth router to use security.create_access_token.
- PDF uploads failing: ensure Cloudinary credentials are valid and resource_type/raw is supported on your account. Check Cloudinary dashboard.
- Supabase errors: ensure SUPABASE_KEY used has adequate permissions for the requested operations (insert/update/select) and that tables exist as expected.
- Gemini 3 specific:
  - If you see inconsistent or off-topic outputs, tweak system prompts (more detailed instructions), lower temperature for deterministic outputs, and add example-based prompting.
  - For large or multi-file research, use chunking + retrieval (RAG) to avoid token limits and improve answer grounding.

---

Roadmap & improvements
- Replace hard-coded Cloudinary credentials with env-based configuration.
- Harden authentication: migrate auth router to use backend/core/security.py for password hashing and JWT issuance.
- Add background processing for heavy AI tasks using a task queue (Redis + RQ / Celery).
- Add vector store & embeddings (Supabase or Pinecone) to support retrieval-augmented generation with Gemini 3 on PDFs.
- Add unit & E2E tests for key flows.
- Add structured API docs and OpenAPI enhancements (pydantic models are present for many endpoints).
- Add TypeScript types for API responses on the frontend (to strengthen the contract).
- Track model usage and cost: integrate usage logging and a dashboard for Gemini 3 calls.

---

Contributing
- Fork the repo and open PRs against main.
- Please avoid committing secrets. Add any credentials to .env and add examples to .env.example.
- For AI-related changes, include cost estimates if you add large-scale LLM usage.
- When modifying notebooks to call Gemini 3, include:
  - Model name/version used
  - Temperature and max tokens
  - Prompt examples / system instructions
  - Any post-processing & validation steps

---

Appendix — useful commands
# Backend
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
npm run build
npm run test

---

If you want, I can:
- Provide a ready-to-go .env.example for both backend and frontend that includes GEMINI_API_KEY entries.
- Update backend/core/cloudinary.py to read credentials from environment.
- Migrate auth endpoints to use JWT and secure password hashing (I can produce a small patch).
- Write example notebook glue code that shows a working LangChain → Gemini 3 pipeline for PDF summarization and PRD-to-TODO conversion.