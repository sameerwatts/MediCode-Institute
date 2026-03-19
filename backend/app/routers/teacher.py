"""
routers/teacher.py — Teacher endpoints for course management.

All endpoints require teacher role (via require_teacher dependency).
Ownership is verified for all course-specific operations.

POST /api/teacher/courses                        — Create course
GET  /api/teacher/courses                        — List my courses (paginated)
GET  /api/teacher/courses/{course_id}            — Get course with topics/subtopics
PUT  /api/teacher/courses/{course_id}            — Update course metadata
DELETE /api/teacher/courses/{course_id}           — Delete course (cascades)
POST /api/teacher/courses/{course_id}/publish     — Publish course
POST /api/teacher/courses/{course_id}/unpublish   — Unpublish (back to draft)
POST /api/teacher/courses/{course_id}/topics      — Create topic
PUT  /api/teacher/topics/{topic_id}               — Update topic
DELETE /api/teacher/topics/{topic_id}              — Delete topic
POST /api/teacher/topics/{topic_id}/subtopics     — Create subtopic
PUT  /api/teacher/subtopics/{subtopic_id}         — Update subtopic
DELETE /api/teacher/subtopics/{subtopic_id}        — Delete subtopic
POST /api/teacher/upload-image                     — Upload image to Supabase Storage
"""

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.roles import require_teacher
from app.models.user import User
from app.schemas.course import (
    CourseCreateRequest,
    CourseCreateResponse,
    CourseListItem,
    CourseListResponse,
    CoursePublishResponse,
    CourseTeacherDetail,
    CourseUpdateRequest,
    TopicCreateRequest,
    TopicSummary,
    TopicTeacherDetail,
    TopicUpdateRequest,
    SubtopicCreateRequest,
    SubtopicDetail,
    SubtopicUpdateRequest,
)
from app.services import course_service


router = APIRouter(prefix="/api/teacher", tags=["teacher"])

PAGE_SIZE = 10


def _get_owned_course(course_id: str, teacher_id, db: Session):
    """Helper: fetch course and verify ownership, or raise 404/403."""
    import uuid as _uuid
    try:
        cid = _uuid.UUID(course_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    course = course_service.get_course_by_id(db, cid)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    if not course_service.verify_course_ownership(course, teacher_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this course.",
        )

    return course


@router.post("/courses", response_model=CourseCreateResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    request: CourseCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Create a new draft course."""
    course = course_service.create_course(
        db,
        teacher_id=current_user.id,
        title=request.title,
        description=request.description,
        category=request.category,
        thumbnail_url=request.thumbnail_url,
    )
    db.commit()

    return CourseCreateResponse(
        id=str(course.id),
        slug=course.slug,
    )


@router.get("/courses", response_model=CourseListResponse)
def list_my_courses(
    page: int = Query(1, ge=1, description="Page number"),
    status_filter: str = Query(None, alias="status", description="Filter by status (draft/published)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """List the current teacher's courses, paginated."""
    courses, total = course_service.list_teacher_courses(
        db,
        teacher_id=current_user.id,
        page=page,
        page_size=PAGE_SIZE,
        status_filter=status_filter,
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


@router.get("/courses/{course_id}", response_model=CourseTeacherDetail)
def get_course_detail(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Get full course detail with topics and subtopics for editing."""
    course = _get_owned_course(course_id, current_user.id, db)

    topics = course_service.list_topics_by_course(db, course.id)
    topics_data = []
    for topic in topics:
        subtopics = course_service.list_subtopics_by_topic(db, topic.id)
        topics_data.append(
            TopicTeacherDetail(
                id=str(topic.id),
                title=topic.title,
                order=topic.order,
                subtopics=[
                    SubtopicDetail(
                        id=str(s.id),
                        title=s.title,
                        content=s.content,
                        order=s.order,
                        created_at=s.created_at,
                        updated_at=s.updated_at,
                    )
                    for s in subtopics
                ],
            )
        )

    return CourseTeacherDetail(
        id=str(course.id),
        title=course.title,
        slug=course.slug,
        description=course.description,
        category=course.category,
        thumbnail_url=course.thumbnail_url,
        status=course.status,
        topics=topics_data,
        created_at=course.created_at,
        updated_at=course.updated_at,
    )


@router.put("/courses/{course_id}", response_model=CourseListItem)
def update_course(
    course_id: str,
    request: CourseUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Update course metadata."""
    course = _get_owned_course(course_id, current_user.id, db)

    course = course_service.update_course(
        db,
        course,
        title=request.title,
        description=request.description,
        category=request.category,
        thumbnail_url=request.thumbnail_url,
    )
    db.commit()

    return CourseListItem(
        id=str(course.id),
        title=course.title,
        slug=course.slug,
        description=course.description,
        category=course.category,
        thumbnail_url=course.thumbnail_url,
        status=course.status,
        created_at=course.created_at,
    )


@router.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Delete a course and all its topics/subtopics."""
    course = _get_owned_course(course_id, current_user.id, db)
    course_service.delete_course(db, course)
    db.commit()


@router.post("/courses/{course_id}/publish", response_model=CoursePublishResponse)
def publish_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Publish a draft course."""
    course = _get_owned_course(course_id, current_user.id, db)

    if course.status == "published":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course is already published.",
        )

    course = course_service.publish_course(db, course)
    db.commit()

    return CoursePublishResponse(
        message="Course published successfully.",
        status=course.status,
    )


@router.post("/courses/{course_id}/unpublish", response_model=CoursePublishResponse)
def unpublish_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Unpublish a course (back to draft)."""
    course = _get_owned_course(course_id, current_user.id, db)

    if course.status == "draft":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course is already a draft.",
        )

    course = course_service.unpublish_course(db, course)
    db.commit()

    return CoursePublishResponse(
        message="Course unpublished. Status set to draft.",
        status=course.status,
    )


# ─── Topic endpoints ──────────────────────────────────────────────────────────

def _get_owned_topic(topic_id: str, teacher_id, db: Session):
    """Helper: fetch topic, verify course ownership, or raise 404/403."""
    import uuid as _uuid
    try:
        tid = _uuid.UUID(topic_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    topic = course_service.get_topic_by_id(db, tid)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found.",
        )

    course = course_service.get_course_by_id(db, topic.course_id)
    if not course or not course_service.verify_course_ownership(course, teacher_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this course.",
        )

    return topic


@router.post(
    "/courses/{course_id}/topics",
    response_model=TopicSummary,
    status_code=status.HTTP_201_CREATED,
)
def create_topic(
    course_id: str,
    request: TopicCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Create a new topic in a course."""
    course = _get_owned_course(course_id, current_user.id, db)

    topic = course_service.create_topic(
        db,
        course_id=course.id,
        title=request.title,
    )
    db.commit()

    return TopicSummary(
        id=str(topic.id),
        title=topic.title,
        order=topic.order,
    )


@router.put("/topics/{topic_id}", response_model=TopicSummary)
def update_topic(
    topic_id: str,
    request: TopicUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Update a topic's title or order."""
    topic = _get_owned_topic(topic_id, current_user.id, db)

    topic = course_service.update_topic(
        db,
        topic,
        title=request.title,
        order=request.order,
    )
    db.commit()

    return TopicSummary(
        id=str(topic.id),
        title=topic.title,
        order=topic.order,
    )


@router.delete("/topics/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(
    topic_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Delete a topic and all its subtopics."""
    topic = _get_owned_topic(topic_id, current_user.id, db)
    course_service.delete_topic(db, topic)
    db.commit()


# ─── Subtopic endpoints ───────────────────────────────────────────────────────

def _get_owned_subtopic(subtopic_id: str, teacher_id, db: Session):
    """Helper: fetch subtopic, verify course ownership via topic, or raise 404/403."""
    import uuid as _uuid
    try:
        sid = _uuid.UUID(subtopic_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    subtopic = course_service.get_subtopic_by_id(db, sid)
    if not subtopic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    topic = course_service.get_topic_by_id(db, subtopic.topic_id)
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subtopic not found.",
        )

    course = course_service.get_course_by_id(db, topic.course_id)
    if not course or not course_service.verify_course_ownership(course, teacher_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this course.",
        )

    return subtopic


@router.post(
    "/topics/{topic_id}/subtopics",
    response_model=SubtopicDetail,
    status_code=status.HTTP_201_CREATED,
)
def create_subtopic(
    topic_id: str,
    request: SubtopicCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Create a new subtopic in a topic."""
    topic = _get_owned_topic(topic_id, current_user.id, db)

    subtopic = course_service.create_subtopic(
        db,
        topic_id=topic.id,
        title=request.title,
    )
    db.commit()

    return SubtopicDetail(
        id=str(subtopic.id),
        title=subtopic.title,
        content=subtopic.content,
        order=subtopic.order,
        created_at=subtopic.created_at,
        updated_at=subtopic.updated_at,
    )


@router.put("/subtopics/{subtopic_id}", response_model=SubtopicDetail)
def update_subtopic(
    subtopic_id: str,
    request: SubtopicUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Update a subtopic's title, content, or order."""
    subtopic = _get_owned_subtopic(subtopic_id, current_user.id, db)

    subtopic = course_service.update_subtopic(
        db,
        subtopic,
        title=request.title,
        content=request.content,
        order=request.order,
    )
    db.commit()

    return SubtopicDetail(
        id=str(subtopic.id),
        title=subtopic.title,
        content=subtopic.content,
        order=subtopic.order,
        created_at=subtopic.created_at,
        updated_at=subtopic.updated_at,
    )


@router.delete("/subtopics/{subtopic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtopic(
    subtopic_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_teacher),
):
    """Delete a subtopic."""
    subtopic = _get_owned_subtopic(subtopic_id, current_user.id, db)
    course_service.delete_subtopic(db, subtopic)
    db.commit()


# ─── Image upload ──────────────────────────────────────────────────────────────

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = Query("images", description="Storage subfolder (images, thumbnails, content)"),
    current_user: User = Depends(require_teacher),
):
    """Upload an image to Supabase Storage. Returns the public URL."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed: PNG, JPEG, GIF, WebP, SVG.",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5 MB.",
        )

    from app.services.storage_service import upload_image as storage_upload

    try:
        url = storage_upload(
            file_bytes=file_bytes,
            original_filename=file.filename or "upload.png",
            folder=folder,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )

    return {"url": url}
