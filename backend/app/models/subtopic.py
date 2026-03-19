"""
models/subtopic.py — The `subtopics` table.

Stores content sections within a topic. Each subtopic belongs to a topic
(FK→topics) and holds TipTap rich-text JSON content.

Key indexes:
- (topic_id, order): composite index for efficient ordered listing
"""

import uuid
from sqlalchemy import (
    Column, String, Integer, DateTime, ForeignKey, func,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base


class Subtopic(Base):
    __tablename__ = "subtopics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_id = Column(
        UUID(as_uuid=True),
        ForeignKey("topics.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(200), nullable=False)
    content = Column(JSONB, nullable=True)
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
