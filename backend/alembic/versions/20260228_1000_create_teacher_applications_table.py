"""create teacher_applications table

Revision ID: a1b2c3d4e5f6
Revises: 44ceca283c35
Create Date: 2026-02-28 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "44ceca283c35"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "teacher_applications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("subject_area", sa.String(length=20), nullable=False),
        sa.Column("qualifications", sa.Text(), nullable=False),
        sa.Column("experience_years", sa.Integer(), nullable=False),
        sa.Column("teaching_philosophy", sa.Text(), nullable=False),
        sa.Column("resume_url", sa.String(length=500), nullable=True),
        sa.Column(
            "status",
            sa.String(length=20),
            server_default="pending",
            nullable=False,
        ),
        sa.Column("admin_notes", sa.Text(), nullable=True),
        sa.Column("reviewed_by", sa.UUID(), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("user_id", sa.UUID(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["reviewed_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.CheckConstraint(
            "subject_area IN ('medical', 'cs')",
            name="ck_teacher_applications_subject_area",
        ),
        sa.CheckConstraint(
            "status IN ('pending', 'approved', 'rejected', 'registered')",
            name="ck_teacher_applications_status",
        ),
    )
    op.create_index(
        op.f("ix_teacher_applications_email"),
        "teacher_applications",
        ["email"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_teacher_applications_email"),
        table_name="teacher_applications",
    )
    op.drop_table("teacher_applications")
