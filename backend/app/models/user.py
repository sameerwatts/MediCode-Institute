"""
models/user.py — The `users` table as a Python class.

SQLAlchemy maps this class to a real PostgreSQL table.
Each class attribute with Column() becomes a column in the database.

Why index=True on email?
Every login does a lookup by email. Without an index, PostgreSQL
scans every row in the table. With an index, it finds the user instantly
even with millions of rows.
"""

import uuid
from sqlalchemy import Column, String, Enum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(
        Enum("student", "teacher", "admin", name="user_role"),
        nullable=False,
        default="student",
    )
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),  # PostgreSQL sets this automatically on insert
        nullable=False,
    )
