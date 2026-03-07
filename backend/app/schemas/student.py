"""
schemas/student.py — Pydantic schemas for the admin students list API.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class StudentListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime


class StudentListResponse(BaseModel):
    items: list[StudentListItem]
    total: int
    page: int
    page_size: int
    has_next: bool


class StudentDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
