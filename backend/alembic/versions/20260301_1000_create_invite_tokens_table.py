"""create invite_tokens table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-03-01 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "invite_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("token", sa.String(length=64), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("application_id", sa.UUID(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(
            ["application_id"], ["teacher_applications.id"],
        ),
    )
    op.create_index(
        op.f("ix_invite_tokens_token"),
        "invite_tokens",
        ["token"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_invite_tokens_token"),
        table_name="invite_tokens",
    )
    op.drop_table("invite_tokens")
