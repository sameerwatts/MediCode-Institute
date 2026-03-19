"""
routers/courses.py — Public course endpoints.

No authentication required for browsing.

GET /api/courses        — List published courses (paginated, filterable, searchable)
GET /api/courses/{slug} — Course detail + TOC (no content)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.course import (
    CourseListItem,
    CourseListResponse,
    CoursePublicDetail,
)
from app.services import course_service


router = APIRouter(prefix="/api/courses", tags=["courses"])

PAGE_SIZE = 10


@router.get("", response_model=CourseListResponse)
def list_courses(
    page: int = Query(1, ge=1, description="Page number"),
    category: str = Query(None, description="Filter by category (medical/cs)"),
    search: str = Query(None, description="Search by title"),
    db: Session = Depends(get_db),
):
    """List published courses, paginated with optional category filter and search."""
    courses, total = course_service.list_published_courses(
        db,
        page=page,
        page_size=PAGE_SIZE,
        category=category,
        search=search,
    )

    return CourseListResponse(
        items=[
            CourseListItem(
                id=str(c.id),
                title=c.title,
                slug=c.slug,
                description=c.description,
                category=c.category,
                thumbnail_url=c.thumbnail_url,
                status=c.status,
                created_at=c.created_at,
            )
            for c in courses
        ],
        total=total,
        page=page,
        page_size=PAGE_SIZE,
        has_next=(page * PAGE_SIZE) < total,
    )


@router.get("/{slug}", response_model=CoursePublicDetail)
def get_course_detail(
    slug: str,
    db: Session = Depends(get_db),
):
    """Get published course detail with table of contents (no content bodies)."""
    detail = course_service.get_course_detail_by_slug(db, slug)

    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    return detail
