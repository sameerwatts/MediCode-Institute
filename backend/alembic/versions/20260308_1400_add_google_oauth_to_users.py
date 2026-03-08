"""add google oauth to users

Revision ID: add_google_oauth_to_users
Revises: create_invite_tokens_table
Create Date: 2026-03-08 14:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c3d4e5f6a7b8'
down_revision = 'b2c3d4e5f6a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Make password_hash nullable (OAuth users have no password)
    op.alter_column('users', 'password_hash', nullable=True)

    # Add google_id column with partial unique index (NULL values excluded)
    op.add_column('users', sa.Column('google_id', sa.String(255), nullable=True))
    op.create_index(
        'ix_users_google_id',
        'users',
        ['google_id'],
        unique=True,
        postgresql_where=sa.text('google_id IS NOT NULL'),
    )

    # Add auth_provider column
    op.add_column('users', sa.Column(
        'auth_provider',
        sa.String(20),
        nullable=False,
        server_default='local',
    ))


def downgrade() -> None:
    op.drop_column('users', 'auth_provider')
    op.drop_index('ix_users_google_id', table_name='users')
    op.drop_column('users', 'google_id')
    op.alter_column('users', 'password_hash', nullable=False)
