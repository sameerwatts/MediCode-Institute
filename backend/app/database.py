"""
database.py — SQLAlchemy engine and session factory.

How it works:
- `engine` is the actual connection to PostgreSQL. Created once at startup.
- `SessionLocal` is a factory that creates database sessions on demand.
- `get_db()` is a FastAPI dependency — each request gets its own fresh session.
  The `finally` block ensures the session is always closed, even if an error occurs.
- `Base` is the parent class for all SQLAlchemy models (tables).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings


# psycopg3 requires the dialect prefix "postgresql+psycopg://"
# Normalise whatever the user put in .env so both forms work.
_db_url = settings.database_url.replace(
    "postgresql://", "postgresql+psycopg://", 1
).replace(
    "postgres://", "postgresql+psycopg://", 1
)

engine = create_engine(_db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """
    FastAPI dependency that provides a database session per request.
    Usage in a route: `db: Session = Depends(get_db)`
    """
    db = SessionLocal()
    try:
        yield db      # FastAPI injects `db` into the route function
    finally:
        db.close()    # Always runs — even if the route raised an exception
