"""
models/teacher_application.py — The `teacher_applications` table.

Stores teacher application submissions. Each row tracks an applicant
through the pipeline: pending → approved/rejected → registered.

Key indexes:
- email: frequent lookups for duplicate checks
- status: admin filtering by application status
"""

import uuid
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, ForeignKey, CheckConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class TeacherApplication(Base):
    __tablename__ = "teacher_applications"
    __table_args__ = (
        CheckConstraint(
            "subject_area IN ('medical', 'cs')",
            name="ck_teacher_applications_subject_area",
        ),
        CheckConstraint(
            "status IN ('pending', 'approved', 'rejected', 'registered')",
            name="ck_teacher_applications_status",
        ),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    subject_area = Column(String(20), nullable=False)
    qualifications = Column(Text, nullable=False)
    experience_years = Column(Integer, nullable=False)
    teaching_philosophy = Column(Text, nullable=False)
    resume_url = Column(String(500), nullable=True)
    status = Column(String(20), nullable=False, server_default="pending")
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True,
    )
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True,
    )
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
