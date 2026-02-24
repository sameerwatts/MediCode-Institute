"""
dependencies/auth.py — The `get_current_user` FastAPI dependency.

How FastAPI dependencies work:
  Declare `current_user: User = Depends(get_current_user)` in any route function.
  FastAPI automatically calls get_current_user() before your route runs and
  injects the result as `current_user`. If it raises an HTTPException, FastAPI
  returns that error response and never runs your route.

How the httpOnly cookie is read:
  `Cookie(default=None)` tells FastAPI to look in the request's cookies for
  a cookie named "access_token". This is how we read the token server-side
  without JavaScript ever touching it.
"""

from typing import Optional

from fastapi import Cookie, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth_service import decode_token, get_user_by_id


def get_current_user(
    access_token: Optional[str] = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    """
    Reads the access_token cookie, validates the JWT, and returns the User.
    Raises 401 Unauthorized for any invalid state (missing, expired, tampered).
    """
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

    if not access_token:
        raise unauthorized

    try:
        payload = decode_token(access_token)
        # Ensure this is an access token, not a refresh token
        if payload.get("type") != "access":
            raise unauthorized
        user_id: Optional[str] = payload.get("sub")
        if not user_id:
            raise unauthorized
    except JWTError:
        raise unauthorized

    user = get_user_by_id(db, user_id)
    if user is None:
        raise unauthorized

    return user
