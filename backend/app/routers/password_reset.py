"""
routers/password_reset.py — Password reset endpoints.

Two public endpoints (no auth required):
1. POST /api/auth/forgot-password — request a reset link
2. POST /api/auth/reset-password — consume token and set new password

Security: forgot-password always returns a generic message regardless of
whether the email exists, to prevent user enumeration.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.password_reset import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
)
from app.services import auth_service
from app.services.email_service import send_password_reset
from app.services.password_reset_service import (
    consume_reset_token,
    generate_reset_token,
    validate_reset_token,
)


router = APIRouter(prefix="/api/auth", tags=["auth"])

GENERIC_MESSAGE = "If an account exists with that email, we've sent a reset link."


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Request a password reset link. Always returns a generic success message
    to prevent user enumeration.
    """
    user = auth_service.get_user_by_email(db, request.email)

    # Only send if user exists AND has a password (skip OAuth-only accounts)
    if user and user.password_hash:
        token = generate_reset_token(db, user)
        db.commit()
        send_password_reset(user.email, user.name, token.token)

    return ForgotPasswordResponse(message=GENERIC_MESSAGE)


@router.post("/reset-password", response_model=ResetPasswordResponse)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Reset a user's password using a valid token.
    Validates the token, hashes the new password, and marks the token as used.
    """
    token, user, error_reason = validate_reset_token(db, request.token)

    if error_reason:
        messages = {
            "invalid": "Invalid reset link.",
            "used": "This reset link has already been used.",
            "expired": "This reset link has expired. Please request a new one.",
        }
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=messages.get(error_reason, "Invalid reset link."),
        )

    # Update password
    user.password_hash = auth_service.hash_password(request.new_password)
    consume_reset_token(db, token)
    db.commit()

    return ResetPasswordResponse(message="Password reset successful. Please sign in.")
