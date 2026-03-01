"""
services/email_service.py — Email notifications via Resend.

Handles 4 email types for the teacher application pipeline:
1. Application received (to applicant) — confirmation with app ID + status check link
2. New application (to admins) — notification with applicant info + review link
3. Application approved (to applicant) — invite link with 72h expiry notice
4. Application rejected (to applicant) — polite regret with optional reason

All functions are fire-and-forget: if the email fails, the error is logged
but the calling operation (approve, reject, etc.) is NOT rolled back.
This follows the architecture doc: "Email send fails → Log error, don't fail approval."
"""

import logging
from typing import Optional

import resend

from app.config import settings

logger = logging.getLogger(__name__)


def _is_enabled() -> bool:
    """Check if email sending is configured."""
    return bool(settings.resend_api_key)


def _send(to: str, subject: str, html: str) -> None:
    """Send an email via Resend. Logs errors instead of raising."""
    if not _is_enabled():
        logger.info("Email disabled (no RESEND_API_KEY). Would send to %s: %s", to, subject)
        return

    try:
        resend.api_key = settings.resend_api_key
        resend.Emails.send({
            "from": settings.email_from,
            "to": [to],
            "subject": subject,
            "html": html,
        })
    except Exception:
        logger.exception("Failed to send email to %s: %s", to, subject)


def send_application_received(
    applicant_email: str,
    applicant_name: str,
    application_id: str,
) -> None:
    """Send confirmation email to applicant after submission."""
    status_url = f"{settings.frontend_url}/application-status"

    html = f"""
    <h2>Application Received</h2>
    <p>Hi {applicant_name},</p>
    <p>Thank you for applying to become a teacher at MediCode Institute!
    We've received your application and our team will review it shortly.</p>
    <p><strong>Application ID:</strong> {application_id}</p>
    <p>You can check your application status anytime:</p>
    <p><a href="{status_url}">Check Application Status</a></p>
    <p>Best regards,<br>MediCode Institute Team</p>
    """

    _send(applicant_email, "Application Received — MediCode Institute", html)


def send_admin_new_application(
    admin_email: str,
    applicant_name: str,
    applicant_email: str,
    subject_area: str,
    application_id: str,
) -> None:
    """Notify an admin that a new teacher application was submitted."""
    review_url = f"{settings.frontend_url}/admin/teacher-requests/{application_id}"

    html = f"""
    <h2>New Teacher Application</h2>
    <p>A new teacher application has been submitted:</p>
    <ul>
        <li><strong>Name:</strong> {applicant_name}</li>
        <li><strong>Email:</strong> {applicant_email}</li>
        <li><strong>Subject Area:</strong> {subject_area}</li>
    </ul>
    <p><a href="{review_url}">Review Application</a></p>
    """

    _send(admin_email, f"New Teacher Application — {applicant_name}", html)


def send_application_approved(
    applicant_email: str,
    applicant_name: str,
    invite_token: str,
) -> None:
    """Send approval email with invite signup link."""
    signup_url = f"{settings.frontend_url}/signup?invite={invite_token}"

    html = f"""
    <h2>You're Approved!</h2>
    <p>Hi {applicant_name},</p>
    <p>Great news — your application to teach at MediCode Institute has been approved!</p>
    <p>Click the button below to create your teacher account:</p>
    <p>
        <a href="{signup_url}"
           style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;
                  text-decoration:none;border-radius:6px;font-weight:bold;">
            Create Teacher Account
        </a>
    </p>
    <p><strong>This link expires in 72 hours.</strong>
    If it expires, an admin can re-send a new invite.</p>
    <p>Best regards,<br>MediCode Institute Team</p>
    """

    _send(applicant_email, "You're Approved! — MediCode Institute", html)


def send_application_rejected(
    applicant_email: str,
    applicant_name: str,
    reason: Optional[str] = None,
) -> None:
    """Send rejection email with optional reason."""
    reason_block = ""
    if reason:
        reason_block = f"<p><strong>Feedback:</strong> {reason}</p>"

    html = f"""
    <h2>Application Update</h2>
    <p>Hi {applicant_name},</p>
    <p>Thank you for your interest in teaching at MediCode Institute.
    After careful review, we're unable to move forward with your application at this time.</p>
    {reason_block}
    <p>We encourage you to apply again in the future if your circumstances change.</p>
    <p>Best regards,<br>MediCode Institute Team</p>
    """

    _send(applicant_email, "Application Update — MediCode Institute", html)
