"""
routers/auth.py — The 5 authentication API endpoints.

Route handlers are intentionally thin — they validate input, call a service
function, and return a response. All logic lives in auth_service.py.

IMPORTANT: Why do login and register use the same error for wrong email
AND wrong password?
  If we returned "Email not found" vs "Wrong password" separately, an
  attacker could enumerate which emails are registered just by trying to log in.
  Always use a generic message: "Invalid email or password."

COOKIES — the security settings explained:
  httponly=True    JS cannot read this cookie. Prevents XSS token theft.
  samesite="lax"   Cookie is sent on same-site requests and top-level navigation.
                   Prevents CSRF attacks (cross-site request forgery).
  secure           True in production (HTTPS only). False in development (HTTP localhost).
  path             Refresh token path is restricted to /api/auth/refresh so it's
                   only ever sent to that one URL — even less exposure.
"""

from typing import Optional

from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.application import InviteTokenInvalidResponse, InviteTokenValidResponse
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from app.services import auth_service
from app.services.invite_service import consume_invite_token, validate_invite_token


router = APIRouter(prefix="/api/auth", tags=["auth"])


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Set both JWT tokens as httpOnly cookies on the response."""
    is_secure = settings.env != "development"

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_secure,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/api/auth/refresh",  # Only sent to this exact path — extra safety
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Register a new user account.
    - Checks if email is already taken
    - Hashes the password with bcrypt
    - If invite_token is provided: validates it, sets role=teacher, links to application
    - Otherwise: creates a standard student account
    - Sets httpOnly cookies and returns the user object
    """
    existing = auth_service.get_user_by_email(db, request.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    role = "student"
    invite = None
    application = None

    if request.invite_token:
        invite, application, error_reason = validate_invite_token(db, request.invite_token)

        if error_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid invite token: {error_reason}.",
            )

        # Email on the invite must match the registration email
        if application.email.lower() != request.email.lower().strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration email must match the approved application email.",
            )

        role = "teacher"

    user = auth_service.create_user(db, request.name, request.email, request.password, role=role)

    # If invite-based registration, consume the token and link user to application
    if invite and application:
        consume_invite_token(db, invite)
        application.user_id = user.id
        application.status = "registered"
        db.commit()

    access_token = auth_service.create_access_token(str(user.id), user.role)
    refresh_token = auth_service.create_refresh_token(str(user.id))

    _set_auth_cookies(response, access_token, refresh_token)

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Account created successfully",
    )


@router.post("/login", response_model=AuthResponse)
def login(
    request: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    """
    Log in with email and password.
    - Looks up user by email
    - Verifies the password against the bcrypt hash
    - Sets httpOnly cookies and returns the user object
    Uses the same generic error for wrong email OR wrong password (security best practice).
    """
    user = auth_service.get_user_by_email(db, request.email)

    if not user or not auth_service.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = auth_service.create_access_token(str(user.id), user.role)
    refresh_token = auth_service.create_refresh_token(str(user.id))

    _set_auth_cookies(response, access_token, refresh_token)

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Login successful",
    )


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    response: Response,
    refresh_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
):
    """
    Exchange a valid refresh token for new access + refresh tokens.
    Called automatically by the frontend when the access token expires.
    The refresh_token cookie is sent automatically by the browser because
    its `path` is "/api/auth/refresh" — it only travels to this URL.
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing.",
        )

    try:
        payload = auth_service.decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type.")
        user_id: Optional[str] = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token.",
        ) from exc

    user = auth_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")

    new_access = auth_service.create_access_token(str(user.id), user.role)
    new_refresh = auth_service.create_refresh_token(str(user.id))
    _set_auth_cookies(response, new_access, new_refresh)

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Token refreshed",
    )


@router.post("/logout")
def logout(response: Response):
    """
    Log out by deleting both cookies from the browser.
    `delete_cookie` sets the cookie with max_age=0, which tells the browser
    to immediately discard it. No token blacklist needed — the cookie is just gone.
    """
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/api/auth/refresh")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Return the currently authenticated user.
    The `Depends(get_current_user)` reads the access_token cookie automatically.
    This is how the frontend knows who is logged in after a page refresh —
    it calls this endpoint on app load and gets the user back from the cookie.
    """
    return UserResponse.model_validate(current_user)


@router.get("/validate-invite")
def validate_invite(
    token: str = Query(..., description="Invite token string"),
    db: Session = Depends(get_db),
):
    """
    Read-only validation of an invite token.
    Used by the frontend signup page to pre-fill name/email when ?invite= is present.
    Does NOT consume the token — that happens during register.
    """
    invite, application, error_reason = validate_invite_token(db, token)

    if error_reason:
        return InviteTokenInvalidResponse(reason=error_reason)

    return InviteTokenValidResponse(
        name=application.name,
        email=application.email,
    )
