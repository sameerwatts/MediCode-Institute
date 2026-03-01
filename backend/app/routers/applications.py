"""
routers/applications.py — Public teacher application endpoints.

POST /api/applications        — Submit a new teacher application
GET  /api/applications/status — Check application status by email + application_id
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.teacher_application import TeacherApplication
from app.models.user import User
from app.schemas.application import (
    ApplicationCreateRequest,
    ApplicationCreateResponse,
    ApplicationStatusResponse,
)
from app.services.email_service import send_admin_new_application, send_application_received


router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post(
    "",
    response_model=ApplicationCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_application(
    request: ApplicationCreateRequest,
    db: Session = Depends(get_db),
):
    """
    Submit a new teacher application.
    Edge cases handled:
    - Duplicate pending application → 409
    - Duplicate after approval (not yet registered) → 409
    - Duplicate after rejection → allowed (new row, old stays in history)
    """
    existing = db.query(TeacherApplication).filter(
        TeacherApplication.email == request.email.lower().strip(),
        TeacherApplication.status.in_(["pending", "approved"]),
    ).first()

    if existing:
        if existing.status == "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You already have a pending application.",
            )
        if existing.status == "approved":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Already approved. Check your email for the invite link.",
            )

    application = TeacherApplication(
        name=request.name.strip(),
        email=request.email.lower().strip(),
        phone=request.phone.strip(),
        subject_area=request.subject_area,
        qualifications=request.qualifications.strip(),
        experience_years=request.experience_years,
        teaching_philosophy=request.teaching_philosophy.strip(),
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Send confirmation email to applicant (fire-and-forget)
    send_application_received(
        applicant_email=application.email,
        applicant_name=application.name,
        application_id=str(application.id),
    )

    # Notify all admin users (fire-and-forget)
    admins = db.query(User).filter(User.role == "admin").all()
    for admin in admins:
        send_admin_new_application(
            admin_email=admin.email,
            applicant_name=application.name,
            applicant_email=application.email,
            subject_area=application.subject_area,
            application_id=str(application.id),
        )

    return ApplicationCreateResponse(
        id=str(application.id),
        message="Application submitted successfully",
        status="pending",
    )


@router.get("/status", response_model=ApplicationStatusResponse)
def check_application_status(
    email: str = Query(..., description="Applicant email"),
    application_id: str = Query(..., description="Application UUID"),
    db: Session = Depends(get_db),
):
    """
    Check the status of a teacher application.
    Requires both email and application_id to prevent enumeration.
    """
    application = db.query(TeacherApplication).filter(
        TeacherApplication.id == application_id,
        TeacherApplication.email == email.lower().strip(),
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found. Check your email and application ID.",
        )

    return ApplicationStatusResponse(
        id=str(application.id),
        status=application.status,
        created_at=application.created_at,
        reviewed_at=application.reviewed_at,
    )
