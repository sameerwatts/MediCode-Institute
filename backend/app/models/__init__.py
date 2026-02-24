# Importing all models here ensures they are registered with Base.metadata.
# Alembic's env.py imports this file so it can discover every table
# when running --autogenerate to create migration scripts.
from app.models.user import User  # noqa: F401
