"""
schemas/course.py — Pydantic schemas for Course, Topic, and Subtopic APIs.

Covers:
- Teacher: create/update course, topic, subtopic
- Public: course list, course detail with TOC, subtopic content
"""

from datetime import datetime
from typing import Optional, Literal, Any
from pydantic import BaseModel, ConfigDict, Field


# ─── Subtopic schemas ─────────────────────────────────────────────────────────

class SubtopicCreateRequest(BaseModel):
    title: str = Field(..., max_length=200)


class SubtopicUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[dict[str, Any]] = None
    order: Optional[int] = Field(None, ge=0)


class SubtopicSummary(BaseModel):
    """Used in TOC — no content."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    order: int


class SubtopicDetail(BaseModel):
    """Full subtopic with content — for enrolled students."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: Optional[dict[str, Any]] = None
    order: int
    created_at: datetime
    updated_at: datetime


# ─── Topic schemas ─────────────────────────────────────────────────────────────

class TopicCreateRequest(BaseModel):
    title: str = Field(..., max_length=200)


class TopicUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    order: Optional[int] = Field(None, ge=0)


class TopicSummary(BaseModel):
    """Used in course list — topic title only."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    order: int


class TopicDetail(BaseModel):
    """Topic with nested subtopic summaries — used in course detail TOC."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    order: int
    subtopics: list[SubtopicSummary] = []


class TopicTeacherDetail(BaseModel):
    """Topic with full subtopic details — used in teacher course editor."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    order: int
    subtopics: list[SubtopicDetail] = []


# ─── Course schemas ────────────────────────────────────────────────────────────

class CourseCreateRequest(BaseModel):
    title: str = Field(..., max_length=200)
    description: str
    category: Literal["medical", "cs"]
    thumbnail_url: Optional[str] = Field(None, max_length=500)


class CourseUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    category: Optional[Literal["medical", "cs"]] = None
    thumbnail_url: Optional[str] = Field(None, max_length=500)


class CourseListItem(BaseModel):
    """Used in public course listing and teacher 'my courses' page."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    slug: str
    description: str
    category: str
    thumbnail_url: Optional[str] = None
    status: str
    created_at: datetime


class CourseListResponse(BaseModel):
    items: list[CourseListItem]
    total: int
    page: int
    page_size: int
    has_next: bool


class CoursePublicDetail(BaseModel):
    """Public course detail — TOC without content."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    slug: str
    description: str
    category: str
    thumbnail_url: Optional[str] = None
    status: str
    teacher_name: str
    topics: list[TopicDetail] = []
    created_at: datetime
    updated_at: datetime


class CourseTeacherDetail(BaseModel):
    """Teacher course detail — full content for editing."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    slug: str
    description: str
    category: str
    thumbnail_url: Optional[str] = None
    status: str
    topics: list[TopicTeacherDetail] = []
    created_at: datetime
    updated_at: datetime


class CourseCreateResponse(BaseModel):
    id: str
    slug: str
    message: str = "Course created successfully"


class CoursePublishResponse(BaseModel):
    message: str
    status: str
