"""
services/password_reset_service.py — Password reset token generation, validation, and consumption.

Security properties:
- Cryptographic: secrets.token_hex(32) — 256 bits of entropy
- Single-use: used_at checked before reset, set after
- Time-limited: 15-minute expiry enforced on every validation
- Re-send safe: old tokens auto-invalidated when new one generated
"""

import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Literal

from sqlalchemy.orm import Session

from app.models.password_reset_token import PasswordResetToken
from app.models.user import User


RESET_EXPIRY_MINUTES = 15


def generate_reset_token(
    db: Session,
    user: User,
) -> PasswordResetToken:
    """
    Generate a new password reset token for a user.
    Invalidates any existing unused tokens for the same user.
    """
    now = datetime.now(timezone.utc)
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used_at.is_(None),
    ).update({"used_at": now})

    token = PasswordResetToken(
        token=secrets.token_hex(32),
        user_id=user.id,
        expires_at=now + timedelta(minutes=RESET_EXPIRY_MINUTES),
    )
    db.add(token)
    db.flush()
    return token


def validate_reset_token(
    db: Session,
    token_str: str,
) -> tuple[Optional[PasswordResetToken], Optional[User], Optional[Literal["expired", "used", "invalid"]]]:
    """
    Validate a password reset token string. Returns (token, user, None) if valid,
    or (None, None, reason) if invalid.
    """
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token_str,
    ).first()

    if not reset_token:
        return None, None, "invalid"

    if reset_token.used_at is not None:
        return None, None, "used"

    now = datetime.now(timezone.utc)
    if reset_token.expires_at.replace(tzinfo=timezone.utc) < now:
        return None, None, "expired"

    user = db.query(User).filter(
        User.id == reset_token.user_id,
    ).first()

    if not user:
        return None, None, "invalid"

    return reset_token, user, None


def consume_reset_token(db: Session, token: PasswordResetToken) -> None:
    """Mark a reset token as used. Caller commits the transaction."""
    token.used_at = datetime.now(timezone.utc)
    db.flush()
