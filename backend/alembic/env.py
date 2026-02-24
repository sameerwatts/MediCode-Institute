"""
alembic/env.py — Alembic migration environment configuration.

This file tells Alembic:
1. How to connect to the database (from DATABASE_URL in .env)
2. Which tables to watch for changes (Base.metadata from our models)

The `target_metadata = Base.metadata` line is critical:
When you run `alembic revision --autogenerate`, Alembic compares what's
in Base.metadata (our Python model definitions) vs what's actually in
the database, and generates the SQL diff as a migration file.

Importing `from app.models import user` is required — it registers the
User model with Base.metadata. Without this import, Alembic would think
there are no tables and generate empty migrations.
"""

import os
import sys
from logging.config import fileConfig

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

# Load .env file so DATABASE_URL is available
load_dotenv()

# Add the backend/ directory to Python path so `from app.xxx` imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import Base and all models to register them with Base.metadata
from app.database import Base
from app.models import user  # noqa: F401 — import registers the model

# Alembic config object (provides access to alembic.ini values)
config = context.config

# Override the sqlalchemy.url with our environment variable.
# Normalise prefix so psycopg3 (psycopg[binary]) is used — not the absent psycopg2.
_raw_url = os.environ["DATABASE_URL"]
_db_url = _raw_url.replace("postgresql://", "postgresql+psycopg://", 1).replace(
    "postgres://", "postgresql+psycopg://", 1
)
config.set_main_option("sqlalchemy.url", _db_url)

# Set up Python logging from the alembic.ini [loggers] section
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# This is what Alembic uses to detect schema changes
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode — generates SQL without connecting to DB.
    Useful for reviewing what SQL will be run before applying it.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode — connects to the DB and applies changes.
    This is what `alembic upgrade head` uses.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
