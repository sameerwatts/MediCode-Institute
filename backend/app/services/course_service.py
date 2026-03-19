"""
services/course_service.py — Course, Topic, and Subtopic CRUD operations.

Covers:
- Create course (with slug generation)
- Get course by ID (with ownership check)
- Update course metadata
- Delete course (cascades to topics/subtopics)
- List teacher's courses (paginated)
- Publish / unpublish course
- Topic CRUD: create, get, update, delete, list by course
- Subtopic CRUD: create, get, update, delete, list by topic
- Public: list published courses, get by slug, get subtopic content
- Enrollment: enroll student, check enrollment status
"""

import re
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from app.models.course import Course
from app.models.topic import Topic
from app.models.subtopic import Subtopic
from app.models.enrollment import Enrollment
from app.models.user import User


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


# ─── Topic CRUD ────────────────────────────────────────────────────────────────

def create_topic(
    db: Session,
    course_id: uuid.UUID,
    title: str,
) -> Topic:
    """Create a topic at the end of the course's topic list. Caller commits."""
    max_order = (
        db.query(Topic.order)
        .filter(Topic.course_id == course_id)
        .order_by(Topic.order.desc())
        .limit(1)
        .scalar()
    )
    next_order = (max_order or 0) + 1

    topic = Topic(
        course_id=course_id,
        title=title,
        order=next_order,
    )
    db.add(topic)
    db.flush()
    return topic


def get_topic_by_id(
    db: Session,
    topic_id: uuid.UUID,
) -> Optional[Topic]:
    """Get a topic by ID. Returns None if not found."""
    return db.query(Topic).filter(Topic.id == topic_id).first()


def update_topic(
    db: Session,
    topic: Topic,
    title: Optional[str] = None,
    order: Optional[int] = None,
) -> Topic:
    """Update topic title and/or order. Caller commits."""
    if title is not None:
        topic.title = title
    if order is not None:
        topic.order = order
    db.flush()
    return topic


def delete_topic(db: Session, topic: Topic) -> None:
    """Delete a topic. CASCADE removes subtopics. Caller commits."""
    db.delete(topic)
    db.flush()


def list_topics_by_course(
    db: Session,
    course_id: uuid.UUID,
) -> list[Topic]:
    """List all topics for a course, ordered by `order`."""
    return (
        db.query(Topic)
        .filter(Topic.course_id == course_id)
        .order_by(Topic.order.asc())
        .all()
    )


# ─── Subtopic CRUD ────────────────────────────────────────────────────────────

def create_subtopic(
    db: Session,
    topic_id: uuid.UUID,
    title: str,
) -> Subtopic:
    """Create a subtopic at the end of the topic's subtopic list. Caller commits."""
    max_order = (
        db.query(Subtopic.order)
        .filter(Subtopic.topic_id == topic_id)
        .order_by(Subtopic.order.desc())
        .limit(1)
        .scalar()
    )
    next_order = (max_order or 0) + 1

    subtopic = Subtopic(
        topic_id=topic_id,
        title=title,
        order=next_order,
    )
    db.add(subtopic)
    db.flush()
    return subtopic


def get_subtopic_by_id(
    db: Session,
    subtopic_id: uuid.UUID,
) -> Optional[Subtopic]:
    """Get a subtopic by ID. Returns None if not found."""
    return db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()


def update_subtopic(
    db: Session,
    subtopic: Subtopic,
    title: Optional[str] = None,
    content: Optional[dict] = None,
    order: Optional[int] = None,
) -> Subtopic:
    """Update subtopic title, content, and/or order. Caller commits."""
    if title is not None:
        subtopic.title = title
    if content is not None:
        subtopic.content = content
    if order is not None:
        subtopic.order = order
    db.flush()
    return subtopic


def delete_subtopic(db: Session, subtopic: Subtopic) -> None:
    """Delete a subtopic. Caller commits."""
    db.delete(subtopic)
    db.flush()


def list_subtopics_by_topic(
    db: Session,
    topic_id: uuid.UUID,
) -> list[Subtopic]:
    """List all subtopics for a topic, ordered by `order`."""
    return (
        db.query(Subtopic)
        .filter(Subtopic.topic_id == topic_id)
        .order_by(Subtopic.order.asc())
        .all()
    )


# ─── Public queries ────────────────────────────────────────────────────────────

def list_published_courses(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[list[Course], int]:
    """
    List published courses for public browsing, paginated.
    Optional category filter and title search.
    Returns (courses, total_count).
    """
    query = db.query(Course).filter(Course.status == "published")

    if category:
        query = query.filter(Course.category == category)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))

    total = query.count()
    courses = (
        query
        .order_by(Course.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return courses, total


def get_course_by_slug(
    db: Session,
    slug: str,
) -> Optional[Course]:
    """Get a published course by slug. Returns None if not found."""
    return (
        db.query(Course)
        .filter(Course.slug == slug, Course.status == "published")
        .first()
    )


def get_course_detail_by_slug(
    db: Session,
    slug: str,
) -> Optional[dict]:
    """
    Get full course detail by slug with teacher name and nested TOC.
    Returns None if course not found or not published.
    """
    course = get_course_by_slug(db, slug)
    if not course:
        return None

    teacher = db.query(User).filter(User.id == course.teacher_id).first()
    teacher_name = teacher.name if teacher else "Unknown"

    topics = list_topics_by_course(db, course.id)
    topics_with_subtopics = []
    for topic in topics:
        subtopics = list_subtopics_by_topic(db, topic.id)
        topics_with_subtopics.append({
            "id": str(topic.id),
            "title": topic.title,
            "order": topic.order,
            "subtopics": [
                {
                    "id": str(s.id),
                    "title": s.title,
                    "order": s.order,
                }
                for s in subtopics
            ],
        })

    return {
        "id": str(course.id),
        "title": course.title,
        "slug": course.slug,
        "description": course.description,
        "category": course.category,
        "thumbnail_url": course.thumbnail_url,
        "status": course.status,
        "teacher_name": teacher_name,
        "topics": topics_with_subtopics,
        "created_at": course.created_at,
        "updated_at": course.updated_at,
    }


def get_subtopic_content(
    db: Session,
    subtopic_id: uuid.UUID,
) -> Optional[Subtopic]:
    """Get a subtopic with its content. Returns None if not found."""
    return db.query(Subtopic).filter(Subtopic.id == subtopic_id).first()


# ─── Enrollment ────────────────────────────────────────────────────────────────

def enroll_student(
    db: Session,
    student_id: uuid.UUID,
    course_id: uuid.UUID,
) -> Enrollment:
    """Enroll a student in a course. Caller commits."""
    enrollment = Enrollment(
        student_id=student_id,
        course_id=course_id,
    )
    db.add(enrollment)
    db.flush()
    return enrollment


def check_enrollment(
    db: Session,
    student_id: uuid.UUID,
    course_id: uuid.UUID,
) -> Optional[Enrollment]:
    """Check if a student is enrolled in a course. Returns enrollment or None."""
    return (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
        )
        .first()
    )
