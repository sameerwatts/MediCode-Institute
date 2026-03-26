"""
schemas/teacher.py — Pydantic schemas for the public teachers API.

Covers:
- Public: list teachers for the "Meet Our Team" section
"""

from typing import Optional
from pydantic import BaseModel


class TeacherPublicItem(BaseModel):
    id: str
    name: str
    designation: str
    department: str
    bio: str
    avatar: str


class TeacherListResponse(BaseModel):
    items: list[TeacherPublicItem]
