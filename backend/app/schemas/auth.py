"""
schemas/auth.py — Pydantic models that define the API contract.

Why are these SEPARATE from the SQLAlchemy models?
- SQLAlchemy models represent database tables (include password_hash).
- Pydantic schemas represent what goes IN and OUT of the API.
- You never want to accidentally return password_hash in a response.
  Keeping them separate makes that impossible by design.

EmailStr: Pydantic validates the email format automatically.
from_attributes=True: Allows `UserResponse.model_validate(db_user)` where
  `db_user` is a SQLAlchemy object (not a plain dict).
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# ─── Request bodies (what the frontend sends) ───────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    invite_token: Optional[str] = None  # If present → validate + set role=teacher


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ─── Response bodies (what FastAPI sends back) ──────────────────────────────

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str           # UUID serialized as string — JSON-compatible
    name: str
    email: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    # UUID objects need to be serialized as strings for JSON
    @classmethod
    def model_validate(cls, obj, **kwargs):
        if hasattr(obj, "id") and not isinstance(obj.id, str):
            obj_dict = {
                "id": str(obj.id),
                "name": obj.name,
                "email": obj.email,
                "role": obj.role,
                "avatar_url": obj.avatar_url,
                "created_at": obj.created_at,
            }
            return cls(**obj_dict)
        return super().model_validate(obj, **kwargs)


class AuthResponse(BaseModel):
    user: UserResponse
    message: str
