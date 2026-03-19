"""
services/course_service.py — Course CRUD operations.

Covers:
- Create course (with slug generation)
- Get course by ID (with ownership check)
- Update course metadata
- Delete course (cascades to topics/subtopics)
- List teacher's courses (paginated)
- Publish / unpublish course
"""

import re
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from app.models.course import Course


def _generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from a title, with a short UUID suffix."""
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    suffix = uuid.uuid4().hex[:8]
    return f"{base}-{suffix}"


def create_course(
    db: Session,
    teacher_id: uuid.UUID,
    title: str,
    description: str,
    category: str,
    thumbnail_url: Optional[str] = None,
) -> Course:
    """Create a new draft course. Caller commits the transaction."""
    course = Course(
        teacher_id=teacher_id,
        title=title,
        slug=_generate_slug(title),
        description=description,
        category=category,
        thumbnail_url=thumbnail_url,
    )
    db.add(course)
    db.flush()
    return course


def get_course_by_id(
    db: Session,
    course_id: uuid.UUID,
) -> Optional[Course]:
    """Get a course by ID. Returns None if not found."""
    return db.query(Course).filter(Course.id == course_id).first()


def verify_course_ownership(
    course: Course,
    teacher_id: uuid.UUID,
) -> bool:
    """Check if the teacher owns the course."""
    return course.teacher_id == teacher_id


def update_course(
    db: Session,
    course: Course,
    title: Optional[str] = None,
    description: Optional[str] = None,
    category: Optional[str] = None,
    thumbnail_url: Optional[str] = None,
) -> Course:
    """Update course metadata. Regenerates slug if title changes. Caller commits."""
    if title is not None:
        course.title = title
        course.slug = _generate_slug(title)
    if description is not None:
        course.description = description
    if category is not None:
        course.category = category
    if thumbnail_url is not None:
        course.thumbnail_url = thumbnail_url
    db.flush()
    return course


def delete_course(db: Session, course: Course) -> None:
    """Delete a course. CASCADE removes topics/subtopics. Caller commits."""
    db.delete(course)
    db.flush()


def list_teacher_courses(
    db: Session,
    teacher_id: uuid.UUID,
    page: int = 1,
    page_size: int = 10,
    status_filter: Optional[str] = None,
) -> tuple[list[Course], int]:
    """
    List courses for a teacher, paginated.
    Returns (courses, total_count).
    """
    query = db.query(Course).filter(Course.teacher_id == teacher_id)

    if status_filter:
        query = query.filter(Course.status == status_filter)

    total = query.count()
    courses = (
        query
        .order_by(Course.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return courses, total


def publish_course(db: Session, course: Course) -> Course:
    """Set course status to published. Caller commits."""
    course.status = "published"
    db.flush()
    return course


def unpublish_course(db: Session, course: Course) -> Course:
    """Set course status back to draft. Caller commits."""
    course.status = "draft"
    db.flush()
    return course
