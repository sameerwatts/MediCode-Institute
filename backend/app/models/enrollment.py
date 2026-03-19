"""
models/enrollment.py — The `enrollments` table.

Tracks which students are enrolled in which courses. Each enrollment
is unique per (student_id, course_id) pair.

Key constraints:
- UNIQUE(student_id, course_id): prevents duplicate enrollments
"""

import uuid
from sqlalchemy import (
    Column, DateTime, ForeignKey, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint(
            "student_id", "course_id", name="uq_enrollments_student_course",
        ),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    course_id = Column(
        UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False,
    )
    enrolled_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
