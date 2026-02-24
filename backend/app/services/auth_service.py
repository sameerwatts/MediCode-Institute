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

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User


# CryptContext handles bcrypt hashing. `deprecated="auto"` means if you ever
# switch to a stronger algorithm, old hashes are automatically migrated on login.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Password utilities ──────────────────────────────────────────────────────

def hash_password(plain_password: str) -> str:
    """Hash a plain-text password with bcrypt (includes random salt)."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain-text password matches the stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


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


def create_user(db: Session, name: str, email: str, password: str) -> User:
    """
    Create a new user with a hashed password.
    db.refresh(user) re-fetches the row from the DB so that auto-generated
    fields like `id` and `created_at` are populated on the returned object.
    """
    user = User(
        name=name.strip(),
        email=email.lower().strip(),
        password_hash=hash_password(password),
        role="student",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
