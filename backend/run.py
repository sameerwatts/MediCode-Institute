"""
run.py — Starts the FastAPI development server.

Run this with: python run.py
Then open: http://localhost:8000/docs
  FastAPI auto-generates an interactive API docs page (Swagger UI).
  You can test all endpoints directly from the browser — no Postman needed!

reload=True means the server automatically restarts when you save a file,
just like Next.js hot reload.

Note: In production Render uses the startCommand in render.yaml directly
(uvicorn app.main:app --host 0.0.0.0 --port $PORT). This file is for
local development only.
"""

import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )
