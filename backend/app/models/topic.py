"""
models/topic.py — The `topics` table.

Stores ordered sections within a course. Each topic belongs to a course
(FK→courses) and contains subtopics with the actual content.

Key indexes:
- (course_id, order): composite index for efficient ordered listing
"""

import uuid
from sqlalchemy import (
    Column, String, Integer, DateTime, ForeignKey, func,
)
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(
        UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(200), nullable=False)
    order = Column(Integer, nullable=False, server_default="0")
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
