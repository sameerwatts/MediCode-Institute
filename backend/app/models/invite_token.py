"""
models/invite_token.py — The `invite_tokens` table.

Stores cryptographic invite tokens sent to approved teacher applicants.
Each token is single-use, time-limited (72h), and email-bound.

Key indexes:
- token: unique, for fast lookup during signup validation
"""

import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class InviteToken(Base):
    __tablename__ = "invite_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    token = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    application_id = Column(
        UUID(as_uuid=True),
        ForeignKey("teacher_applications.id"),
        nullable=False,
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False,
    )
