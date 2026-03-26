"""
routers/teachers.py — Public teacher endpoints.

GET /api/teachers — List all registered teachers for "Meet Our Team"
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.teacher import TeacherListResponse, TeacherPublicItem
from app.services import teacher_public_service


router = APIRouter(prefix="/api/teachers", tags=["teachers"])


@router.get("", response_model=TeacherListResponse)
def list_teachers(db: Session = Depends(get_db)):
    """List all registered teachers with public profile info."""
    teachers = teacher_public_service.list_public_teachers(db)

    return TeacherListResponse(
        items=[TeacherPublicItem(**t) for t in teachers],
    )
