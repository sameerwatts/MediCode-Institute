"""
services/auth_service.py — All authentication business logic.

Keeping logic here (not in the route handlers) means:
- Routes stay thin and readable — they just call service functions
- Logic is easier to test in isolation
- Later when you add teacher/admin flows, the service functions are reusable

PASSWORD HASHING — why bcrypt?
  bcrypt automatically generates a random "salt" for each password before hashing.
  This means even if two users have the same password, their hashes are different.
  This defeats "rainbow table" attacks (precomputed hash lookup tables).
  verify_password() extracts the salt from the stored hash to re-hash and compare.

JWT TOKENS — what's in the payload?
  "sub" (subject) — the user's ID. Standard JWT claim.
  "role"          — stored in access token so we can check permissions without a DB hit.
  "type"          — "access" or "refresh" — we check this to prevent token misuse.
  "exp"           — expiry timestamp. python-jose validates this automatically.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import httpx
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User


# ─── Password utilities ──────────────────────────────────────────────────────

def hash_password(plain_password: str) -> str:
    """Hash a plain-text password with bcrypt (includes random salt)."""
    return bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain-text password matches the stored bcrypt hash."""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


# ─── JWT utilities ───────────────────────────────────────────────────────────

def create_access_token(user_id: str, role: str) -> str:
    """
    Create a short-lived JWT access token (30 min by default).
    This is sent with every authenticated API request.
    """
    payload = {
        "sub": user_id,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        ),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(user_id: str) -> str:
    """
    Create a long-lived JWT refresh token (7 days by default).
    Used only to silently obtain a new access token when it expires.
    Stored in a cookie restricted to /api/auth/refresh so it travels less.
    """
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(
            days=settings.refresh_token_expire_days
        ),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    Raises jose.JWTError if the token is invalid, tampered with, or expired.
    Callers must catch JWTError.
    """
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])


# ─── Database queries ────────────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_google_id(db: Session, google_id: str) -> Optional[User]:
    return db.query(User).filter(User.google_id == google_id).first()


def create_user(
    db: Session, name: str, email: str, password: str, role: str = "student"
) -> User:
    """
    Create a new user with a hashed password.
    db.refresh(user) re-fetches the row from the DB so that auto-generated
    fields like `id` and `created_at` are populated on the returned object.
    role defaults to 'student'; pass 'teacher' for invite-based registration.
    """
    user = User(
        name=name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ─── Google OAuth ─────────────────────────────────────────────────────────────

def exchange_google_code(code: str, redirect_uri: str) -> Optional[dict]:
    """
    Exchange an authorization code for Google user info.
    1. POST to Google token endpoint to get access token.
    2. GET Google userinfo using that access token.
    3. Verify the email is verified.
    Returns { google_id, email, name, picture } or None on any failure.
    """
    try:
        token_res = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
            timeout=10,
        )
        token_res.raise_for_status()
        google_access_token = token_res.json().get("access_token")
        if not google_access_token:
            return None

        userinfo_res = httpx.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {google_access_token}"},
            timeout=10,
        )
        userinfo_res.raise_for_status()
        userinfo = userinfo_res.json()

        if not userinfo.get("verified_email"):
            return None

        return {
            "google_id": userinfo["id"],
            "email": userinfo["email"],
            "name": userinfo.get("name", ""),
            "picture": userinfo.get("picture"),
        }
    except Exception:
        return None


def find_or_create_google_user(db: Session, google_user: dict) -> User:
    """
    Find or create a user from Google OAuth data.
    1. Look up by google_id → if found: update avatar and return.
    2. Look up by email → if found:
       - Teacher/admin: raise ValueError (blocked).
       - Student: link google_id, set auth_provider="both", return.
    3. Neither → create new student with auth_provider="google".
    """
    # 1. Lookup by google_id
    user = get_user_by_google_id(db, google_user["google_id"])
    if user:
        user.avatar_url = google_user.get("picture") or user.avatar_url
        db.commit()
        db.refresh(user)
        return user

    # 2. Lookup by email
    user = get_user_by_email(db, google_user["email"])
    if user:
        if user.role in ("teacher", "admin"):
            raise ValueError("oauth_role_not_permitted")
        user.google_id = google_user["google_id"]
        user.auth_provider = "both"
        user.avatar_url = google_user.get("picture") or user.avatar_url
        db.commit()
        db.refresh(user)
        return user

    # 3. Create new student
    user = User(
        name=google_user["name"].strip() or google_user["email"].split("@")[0],
        email=google_user["email"].lower().strip(),
        password_hash=None,
        role="student",
        google_id=google_user["google_id"],
        auth_provider="google",
        avatar_url=google_user.get("picture"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
