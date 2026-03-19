"""
routers/courses.py — Public and student course endpoints.

Browsing is public. Enrollment and content access require authentication.

GET  /api/courses                              — List published courses
GET  /api/courses/{slug}                       — Course detail + TOC (no content)
POST /api/courses/{slug}/enroll                — Enroll (requires auth + student role)
GET  /api/courses/{slug}/enrollment-status     — Check enrollment
GET  /api/courses/{slug}/subtopics/{subtopic_id} — Get content (requires enrollment)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.course import (
    CourseListItem,
    CourseListResponse,
    CoursePublicDetail,
    EnrollResponse,
    EnrollmentStatusResponse,
    SubtopicDetail,
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


@router.post("/{slug}/enroll", response_model=EnrollResponse, status_code=status.HTTP_201_CREATED)
def enroll_in_course(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Enroll the current student in a published course."""
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can enroll in courses.",
        )

    course = course_service.get_course_by_slug(db, slug)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    existing = course_service.check_enrollment(db, current_user.id, course.id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already enrolled in this course.",
        )

    enrollment = course_service.enroll_student(db, current_user.id, course.id)
    db.commit()

    return EnrollResponse(enrolled_at=enrollment.enrolled_at)


@router.get("/{slug}/enrollment-status", response_model=EnrollmentStatusResponse)
def check_enrollment_status(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Check if the current user is enrolled in a course."""
    course = course_service.get_course_by_slug(db, slug)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    enrollment = course_service.check_enrollment(db, current_user.id, course.id)

    return EnrollmentStatusResponse(
        enrolled=enrollment is not None,
        enrolled_at=enrollment.enrolled_at if enrollment else None,
    )


@router.get("/{slug}/subtopics/{subtopic_id}", response_model=SubtopicDetail)
def get_subtopic_content(
    slug: str,
    subtopic_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get subtopic content. Requires enrollment in the course."""
    course = course_service.get_course_by_slug(db, slug)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    enrollment = course_service.check_enrollment(db, current_user.id, course.id)
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled to access course content.",
        )

    import uuid as _uuid
    try:
        sid = _uuid.UUID(subtopic_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    subtopic = course_service.get_subtopic_content(db, sid)
    if not subtopic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    # Verify subtopic belongs to this course via its topic
    topic = course_service.get_topic_by_id(db, subtopic.topic_id)
    if not topic or topic.course_id != course.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    return SubtopicDetail(
        id=str(subtopic.id),
        title=subtopic.title,
        content=subtopic.content,
        order=subtopic.order,
        created_at=subtopic.created_at,
        updated_at=subtopic.updated_at,
    )
