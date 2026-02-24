"""
main.py — FastAPI app entry point.

CORS (Cross-Origin Resource Sharing) explained:
  Browsers enforce a rule: if your frontend is at localhost:3000 and tries to
  talk to localhost:8000, the browser blocks it unless the server says
  "I allow requests from that origin."

  With cookies, two things are REQUIRED:
  1. allow_credentials=True on the server
  2. withCredentials: true on every axios/fetch call on the frontend
  3. allow_origins must list EXACT origins — you cannot use ["*"] with credentials

  The Next.js proxy (next.config.ts rewrites) means in development the browser
  only ever sees localhost:3000, so CORS is not actually triggered. But in
  production (Vercel frontend → Render backend), CORS matters fully.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth


app = FastAPI(
    title="MediCode Institute API",
    description="Backend API for MediCode Institute — authentication, courses, quizzes, and more.",
    version="0.1.0",
)

# CORS must be added BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    # Origins are read from the ALLOWED_ORIGINS env var (comma-separated).
    # Set this in Render dashboard to include your Vercel domain(s).
    allow_origins=settings.origins_list,
    allow_credentials=True,   # REQUIRED for httpOnly cookies to work across origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth.router)


@app.get("/", tags=["health"])
def health_check():
    """Quick health check — confirms the API is running."""
    return {"status": "ok", "service": "MediCode Institute API"}
