"""
models/course.py — The `courses` table.

Stores teacher-created courses with metadata and publish status.
Each course belongs to a teacher (FK→users) and can be draft or published.

Key indexes:
- slug: unique index for URL-friendly lookups (/courses/{slug})
"""

import uuid
from sqlalchemy import (
    Column, String, Text, DateTime, ForeignKey, CheckConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (
        CheckConstraint(
            "category IN ('medical', 'cs')",
            name="ck_courses_category",
        ),
        CheckConstraint(
            "status IN ('draft', 'published')",
            name="ck_courses_status",
        ),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    title = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(20), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, server_default="draft")
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
