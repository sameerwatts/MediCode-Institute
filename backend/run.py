"""
run.py — Starts the FastAPI development server.

Run this with: python run.py
Then open: http://localhost:8000/docs
  FastAPI auto-generates an interactive API docs page (Swagger UI).
  You can test all endpoints directly from the browser — no Postman needed!

reload=True means the server automatically restarts when you save a file,
just like Next.js hot reload.
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
