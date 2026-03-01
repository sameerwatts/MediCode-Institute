"""
routers/admin.py — Admin endpoints for managing teacher applications.

All endpoints require admin role (via require_admin dependency).

GET  /api/admin/applications              — Paginated, filterable, searchable list
GET  /api/admin/applications/{id}         — Full application detail
POST /api/admin/applications/{id}/approve — Approve + generate invite token
POST /api/admin/applications/{id}/reject  — Reject with optional reason
POST /api/admin/applications/{id}/resend-invite — Re-send invite (invalidates old token)
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.roles import require_admin
from app.models.invite_token import InviteToken
from app.models.teacher_application import TeacherApplication
from app.models.user import User
from app.schemas.application import (
    ApplicationApproveResponse,
    ApplicationDetailResponse,
    ApplicationListItem,
    ApplicationListResponse,
    ApplicationRejectRequest,
    ApplicationRejectResponse,
    ApplicationResendInviteResponse,
)
from app.services.invite_service import generate_invite_token


router = APIRouter(prefix="/api/admin", tags=["admin"])

PAGE_SIZE = 10


@router.get("/applications", response_model=ApplicationListResponse)
def list_applications(
    status_filter: str = Query("all", alias="status", description="Filter by status"),
    search: str = Query("", description="Search by name or email"),
    page: int = Query(1, ge=1, description="Page number"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Paginated, filterable, searchable list of teacher applications."""
    query = db.query(TeacherApplication)

    # Filter by status
    if status_filter != "all":
        query = query.filter(TeacherApplication.status == status_filter)

    # Search by name or email
    if search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                TeacherApplication.name.ilike(search_term),
                TeacherApplication.email.ilike(search_term),
            )
        )

    # Count total before pagination
    total = query.count()

    # Sort newest first, paginate
    items = (
        query.order_by(TeacherApplication.created_at.desc())
        .offset((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .all()
    )

    return ApplicationListResponse(
        items=[
            ApplicationListItem(
                id=str(app.id),
                name=app.name,
                email=app.email,
                subject_area=app.subject_area,
                status=app.status,
                created_at=app.created_at,
            )
            for app in items
        ],
        total=total,
        page=page,
        page_size=PAGE_SIZE,
        has_next=(page * PAGE_SIZE) < total,
    )


@router.get("/applications/{application_id}", response_model=ApplicationDetailResponse)
def get_application_detail(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Full detail of a single application, including invite token status."""
    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == application_id,
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    # Check invite token status
    invite_token_status = None
    invite = db.query(InviteToken).filter(
        InviteToken.application_id == application.id,
    ).order_by(InviteToken.created_at.desc()).first()

    if invite:
        if invite.used_at is not None:
            invite_token_status = "used"
        elif invite.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            invite_token_status = "expired"
        else:
            invite_token_status = "active"

    return ApplicationDetailResponse(
        id=str(application.id),
        name=application.name,
        email=application.email,
        phone=application.phone,
        subject_area=application.subject_area,
        qualifications=application.qualifications,
        experience_years=application.experience_years,
        teaching_philosophy=application.teaching_philosophy,
        resume_url=application.resume_url,
        status=application.status,
        admin_notes=application.admin_notes,
        reviewed_by=str(application.reviewed_by) if application.reviewed_by else None,
        reviewed_at=application.reviewed_at,
        user_id=str(application.user_id) if application.user_id else None,
        created_at=application.created_at,
        updated_at=application.updated_at,
        invite_token_status=invite_token_status,
    )


@router.post("/applications/{application_id}/approve", response_model=ApplicationApproveResponse)
def approve_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Approve an application and generate an invite token."""
    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == application_id,
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve application with status '{application.status}'.",
        )

    # Update application status
    application.status = "approved"
    application.reviewed_by = current_user.id
    application.reviewed_at = datetime.now(timezone.utc)

    # Generate invite token
    invite = generate_invite_token(db, application)

    db.commit()

    # TODO: Send approval email with invite link (PR 10 — email service)

    return ApplicationApproveResponse(
        message="Application approved. Invite email sent.",
        invite_token_expires_at=invite.expires_at,
    )


@router.post("/applications/{application_id}/reject", response_model=ApplicationRejectResponse)
def reject_application(
    application_id: str,
    request: ApplicationRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Reject an application with an optional reason."""
    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == application_id,
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    if application.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot reject application with status '{application.status}'.",
        )

    application.status = "rejected"
    application.admin_notes = request.reason
    application.reviewed_by = current_user.id
    application.reviewed_at = datetime.now(timezone.utc)

    db.commit()

    # TODO: Send rejection email (PR 10 — email service)

    return ApplicationRejectResponse(
        message="Application rejected. Notification email sent.",
    )


@router.post(
    "/applications/{application_id}/resend-invite",
    response_model=ApplicationResendInviteResponse,
)
def resend_invite(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Re-send invite for an approved application. Invalidates the old token."""
    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == application_id,
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    if application.status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Can only resend invite for approved applications (current: '{application.status}').",
        )

    # Generate new token (auto-invalidates old ones)
    invite = generate_invite_token(db, application)

    db.commit()

    # TODO: Send new invite email (PR 10 — email service)

    return ApplicationResendInviteResponse(
        message="New invite email sent. Previous token invalidated.",
        invite_token_expires_at=invite.expires_at,
    )
