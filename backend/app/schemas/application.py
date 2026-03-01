"""
schemas/application.py — Pydantic schemas for the teacher application API.

Covers:
- Public: submit application, check status
- Admin: paginated list, full detail, approve/reject/resend responses
- Invite token validation
"""

from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, ConfigDict, Field


# ─── Public request/response schemas ────────────────────────────────────────

class ApplicationCreateRequest(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    subject_area: Literal["medical", "cs"]
    qualifications: str
    experience_years: int = Field(..., ge=0)
    teaching_philosophy: str


class ApplicationCreateResponse(BaseModel):
    id: str
    message: str = "Application submitted successfully"
    status: str = "pending"


class ApplicationStatusResponse(BaseModel):
    id: str
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None


# ─── Admin response schemas ─────────────────────────────────────────────────

class ApplicationListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    subject_area: str
    status: str
    created_at: datetime


class ApplicationListResponse(BaseModel):
    items: list[ApplicationListItem]
    total: int
    page: int
    page_size: int
    has_next: bool


class ApplicationDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: str
    subject_area: str
    qualifications: str
    experience_years: int
    teaching_philosophy: str
    resume_url: Optional[str] = None
    status: str
    admin_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    invite_token_status: Optional[str] = None


class ApplicationApproveResponse(BaseModel):
    message: str = "Application approved. Invite email sent."
    invite_token_expires_at: datetime


class ApplicationRejectRequest(BaseModel):
    reason: Optional[str] = None


class ApplicationRejectResponse(BaseModel):
    message: str = "Application rejected. Notification email sent."


class ApplicationResendInviteResponse(BaseModel):
    message: str = "New invite email sent. Previous token invalidated."
    invite_token_expires_at: datetime


# ─── Invite token validation ────────────────────────────────────────────────

class InviteTokenValidResponse(BaseModel):
    valid: Literal[True] = True
    name: str
    email: str


class InviteTokenInvalidResponse(BaseModel):
    valid: Literal[False] = False
    reason: Literal["expired", "used", "invalid"]
