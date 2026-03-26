"""
services/teacher_public_service.py — Public teacher listing for "Meet Our Team".

Joins users (role=teacher) with their teacher_applications (status=registered)
to build public profile cards with name, designation (qualifications), department
(subject_area), bio (teaching_philosophy), and avatar.
"""

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.teacher_application import TeacherApplication


def list_public_teachers(db: Session) -> list[dict]:
    """Return all registered teachers with their application profile data."""
    rows = (
        db.query(User, TeacherApplication)
        .join(
            TeacherApplication,
            TeacherApplication.user_id == User.id,
        )
        .filter(
            User.role == "teacher",
            TeacherApplication.status == "registered",
        )
        .order_by(User.created_at)
        .all()
    )

    teachers = []
    for user, app in rows:
        avatar = user.avatar_url or (
            f"https://ui-avatars.com/api/?name={user.name.replace(' ', '+')}"
            f"&background={'7C3AED' if app.subject_area == 'medical' else '2563EB'}"
            f"&color=fff&size=200"
        )
        teachers.append({
            "id": str(user.id),
            "name": user.name,
            "designation": app.qualifications,
            "department": app.subject_area,
            "bio": app.teaching_philosophy,
            "avatar": avatar,
        })

    return teachers
