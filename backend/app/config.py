"""
config.py — Reads environment variables from .env into a typed Settings object.

Why Pydantic BaseSettings?
- Validates types at startup. If SECRET_KEY is missing, the app crashes immediately
  with a clear error instead of failing mysteriously at runtime.
- Gives you IDE autocomplete on `settings.secret_key` etc.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    database_url: str
    env: str = "development"  # "development" or "production"

    # Comma-separated list of allowed CORS origins.
    # Local dev default covers localhost:3000.
    # On Render, set this env var to your Vercel domain(s).
    # Example: "https://medicode-institute.vercel.app,https://medicode-api.onrender.com"
    allowed_origins: str = "http://localhost:3000"

    @property
    def origins_list(self) -> list[str]:
        """Parse comma-separated ALLOWED_ORIGINS into a list."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    class Config:
        env_file = ".env"


# Single shared instance — import this everywhere you need settings
settings = Settings()
