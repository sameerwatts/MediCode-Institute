"""
services/invite_service.py — Invite token generation, validation, and consumption.

Security properties (from architecture doc):
- Cryptographic: secrets.token_hex(32) — 256 bits of entropy
- Single-use: used_at checked before signup, set after
- Time-limited: 72-hour expiry enforced on every validation
- Email-bound: token tied to application email; signup email must match
- Re-send safe: old tokens auto-invalidated when new one generated
"""

import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Literal

from sqlalchemy.orm import Session

from app.models.invite_token import InviteToken
from app.models.teacher_application import TeacherApplication


INVITE_EXPIRY_HOURS = 72


def generate_invite_token(
    db: Session,
    application: TeacherApplication,
) -> InviteToken:
    """
    Generate a new invite token for an approved application.
    Invalidates any existing unused tokens for the same application
    (sets used_at to now so they can't be reused).
    """
    # Invalidate any existing unused tokens for this application
    now = datetime.now(timezone.utc)
    db.query(InviteToken).filter(
        InviteToken.application_id == application.id,
        InviteToken.used_at.is_(None),
    ).update({"used_at": now})

    token = InviteToken(
        token=secrets.token_hex(32),
        email=application.email,
        application_id=application.id,
        expires_at=now + timedelta(hours=INVITE_EXPIRY_HOURS),
    )
    db.add(token)
    db.flush()  # Caller commits the transaction
    return token


def validate_invite_token(
    db: Session,
    token_str: str,
) -> tuple[Optional[InviteToken], Optional[TeacherApplication], Optional[Literal["expired", "used", "invalid"]]]:
    """
    Validate an invite token string. Returns (token, application, None) if valid,
    or (None, None, reason) if invalid.
    """
    invite = db.query(InviteToken).filter(
        InviteToken.token == token_str,
    ).first()

    if not invite:
        return None, None, "invalid"

    if invite.used_at is not None:
        return None, None, "used"

    now = datetime.now(timezone.utc)
    if invite.expires_at.replace(tzinfo=timezone.utc) < now:
        return None, None, "expired"

    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == invite.application_id,
    ).first()

    if not application:
        return None, None, "invalid"

    return invite, application, None


def consume_invite_token(db: Session, invite: InviteToken) -> None:
    """Mark an invite token as used. Caller commits the transaction."""
    invite.used_at = datetime.now(timezone.utc)
    db.flush()
