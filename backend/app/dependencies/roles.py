"""
dependencies/roles.py — Role-based access control dependencies.

These build on top of `get_current_user` to enforce role requirements.
Use them in route functions:

    current_user: User = Depends(require_admin)
    current_user: User = Depends(require_teacher)

If the user is authenticated but lacks the required role, a 403 Forbidden
is raised. If not authenticated at all, `get_current_user` raises 401 first.
"""

from fastapi import Depends, HTTPException, status

from app.models.user import User
from app.dependencies.auth import get_current_user


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Only allow users with role='admin'."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def require_teacher(
    current_user: User = Depends(get_current_user),
) -> User:
    """Only allow users with role='teacher'."""
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher access required",
        )
    return current_user
